import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAuth } from 'src/core/contexts/AuthContext';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { chatApiService } from '../services/chatApi.service';
import { ChatSocketService } from '../services/chatSocket.service';
import { ChatMessage, ChatUser } from '../types/chat.types';
import {
  ChatKeyPair,
  decryptDM,
  decryptGroup,
  encryptDM,
  encryptGroup,
  generateKeyPair,
} from '../utils/crypto';
import { loadKeyPair, saveKeyPair } from '../utils/keyStorage';

// Límite de tamaño del campo content en el servidor (vale para el ciphertext).
const MAX_CONTENT_LEN = 1000;
const UNDECRYPTABLE = '[mensaje cifrado — no se pudo descifrar]';

export interface TypingEntry {
  userId: string;
  nickname: string;
  expiresAt: number;
}

interface ChatContextValue {
  connected: boolean;
  chatUser: ChatUser | null;
  onlineUsers: ChatUser[];
  groupMessages: ChatMessage[];
  directMessages: Record<string, ChatMessage[]>;
  typingInGroup: TypingEntry[];
  typingInDM: Record<string, TypingEntry>;

  sendGroupMessage: (content: string, ttl?: number) => void;
  sendDM: (toId: string, content: string, ttl?: number) => void;
  sendTypingGroup: () => void;
  sendTypingDM: (toId: string) => void;
  sendStopTyping: () => void;
  markRead: (messageId: string) => void;

  joinError: string | null;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  const [connected, setConnected] = useState(false);
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [groupMessages, setGroupMessages] = useState<ChatMessage[]>([]);
  const [directMessages, setDirectMessages] = useState<Record<string, ChatMessage[]>>({});
  const [typingInGroup, setTypingInGroup] = useState<TypingEntry[]>([]);
  const [typingInDM, setTypingInDM] = useState<Record<string, TypingEntry>>({});
  const [joinError, setJoinError] = useState<string | null>(null);

  const socketRef = useRef<ChatSocketService | null>(null);
  const tokenRef = useRef<string>('');
  // Ref keeps chatUser.id accessible inside WS event closure without stale capture
  const chatUserIdRef = useRef<string | null>(null);

  // ── Material de cifrado (refs para evitar closures obsoletas en el WS) ──────
  const myKeyPairRef = useRef<ChatKeyPair | null>(null);
  const userPublicKeysRef = useRef<Record<string, string>>({});
  const groupKeyRef = useRef<string | null>(null);

  // Descifra un DM entrante. Si el remitente no tiene llave pública registrada,
  // asumimos texto plano (cliente sin cifrado) y devolvemos el contenido tal cual.
  const decryptIncomingDM = useCallback((msg: ChatMessage): string => {
    const senderKey = userPublicKeysRef.current[msg.sender_id];
    const mySecret = myKeyPairRef.current?.secretKey;
    if (senderKey && mySecret) {
      const dec = decryptDM(msg.content, senderKey, mySecret);
      return dec !== null ? dec : UNDECRYPTABLE;
    }
    return msg.content;
  }, []);

  // Descifra un mensaje grupal. Sin clave de grupo → texto plano.
  const decryptIncomingGroup = useCallback((msg: ChatMessage): string => {
    const key = groupKeyRef.current;
    if (key) {
      const dec = decryptGroup(msg.content, key);
      return dec !== null ? dec : UNDECRYPTABLE;
    }
    return msg.content;
  }, []);

  // Always join fresh — join is idempotent (same nickname = same user, new valid token).
  // Avoids stale-token reconnect loops since JWT_EXP_SECONDS=3000 (50 min).
  const _doJoin = useCallback(async (nickname: string): Promise<string> => {
    const res = await chatApiService.join(nickname);
    setChatUser(res.user);
    chatUserIdRef.current = res.user.id;
    return res.token;
  }, []);

  const _clearTypingEntry = useCallback((userId: string, isDM: boolean, dmPeerId?: string) => {
    if (isDM && dmPeerId) {
      setTypingInDM(prev => {
        const next = { ...prev };
        delete next[dmPeerId];
        return next;
      });
    } else {
      setTypingInGroup(prev => prev.filter(e => e.userId !== userId));
    }
  }, []);

  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const _scheduleTypingExpiry = useCallback(
    (userId: string, isDM: boolean, dmPeerId?: string) => {
      const key = isDM ? `dm_${dmPeerId}` : `group_${userId}`;
      if (typingTimers.current[key]) clearTimeout(typingTimers.current[key]);
      typingTimers.current[key] = setTimeout(
        () => _clearTypingEntry(userId, isDM, dmPeerId),
        3000,
      );
    },
    [_clearTypingEntry],
  );

  useEffect(() => {
    if (!isAuthenticated || !user?.nickname) return;

    let mounted = true;
    const socket = new ChatSocketService();
    socketRef.current = socket;

    socket.onStatus(c => { if (mounted) setConnected(c); });

    socket.onEvent(ev => {
      if (!mounted) return;

      switch (ev.type) {
        case 'users_list': {
          // Indexamos las llaves públicas para cifrar DMs a cada usuario.
          const keys = { ...userPublicKeysRef.current };
          ev.users.forEach(u => { if (u.public_key) keys[u.id] = u.public_key; });
          userPublicKeysRef.current = keys;
          setOnlineUsers(ev.users);
          break;
        }

        case 'group_history':
          // El group_key llega DESPUÉS; guardamos crudo y desciframos cuando
          // llegue la clave (o se queda en texto plano si no hay clave).
          setGroupMessages(ev.messages.map(m => ({ ...m, content: decryptIncomingGroup(m) })));
          break;

        case 'group_key':
          // Cadena vacía = texto plano (instancia desplegada). Con clave,
          // desciframos el historial ya recibido.
          groupKeyRef.current = ev.key || null;
          if (ev.key) {
            setGroupMessages(prev => prev.map(m => ({ ...m, content: decryptIncomingGroup(m) })));
          }
          break;

        case 'group_message': {
          const decoded = { ...ev.message, content: decryptIncomingGroup(ev.message) };
          setGroupMessages(prev => {
            if (prev.some(m => m.id === ev.message.id)) return prev;
            return [...prev, decoded];
          });
          break;
        }

        case 'dm': {
          const isMine = ev.message.sender_id === chatUserIdRef.current;
          // El emisor NO puede descifrar su propio DM (nacl.box solo lo permite
          // al destinatario). Mantenemos la inserción optimista en texto plano
          // e ignoramos el eco del servidor.
          if (isMine) break;

          const otherId = ev.message.sender_id;
          const decoded = { ...ev.message, content: decryptIncomingDM(ev.message) };
          setDirectMessages(prev => {
            const thread = prev[otherId] ?? [];
            if (thread.some(m => m.id === ev.message.id)) return prev;
            return { ...prev, [otherId]: [...thread, decoded] };
          });
          break;
        }

        case 'message_expired':
          setGroupMessages(prev => prev.filter(m => m.id !== ev.message_id));
          setDirectMessages(prev => {
            const next: Record<string, ChatMessage[]> = {};
            for (const [k, msgs] of Object.entries(prev)) {
              next[k] = msgs.filter(m => m.id !== ev.message_id);
            }
            return next;
          });
          break;

        case 'user_joined':
          if (ev.user.public_key) {
            userPublicKeysRef.current = {
              ...userPublicKeysRef.current,
              [ev.user.id]: ev.user.public_key,
            };
          }
          setOnlineUsers(prev => {
            if (prev.some(u => u.id === ev.user.id)) return prev;
            return [...prev, ev.user];
          });
          break;

        case 'user_left':
          setOnlineUsers(prev => prev.filter(u => u.id !== ev.user_id));
          break;

        case 'typing': {
          const entry: TypingEntry = {
            userId: ev.user_id,
            nickname: ev.nickname,
            expiresAt: Date.now() + 3000,
          };
          // If it's a DM typing (sent to me specifically), key by sender
          // The server routes typing "to" only to that user, so any typing event is DM typing
          // We distinguish group vs DM by checking if the message was directed (no "to" field visible here)
          // Since the server sends the same payload for both, we treat all incoming as group unless
          // we know a DM is in progress — simplest: always push to group, DM screen can filter
          setTypingInGroup(prev => {
            const filtered = prev.filter(e => e.userId !== ev.user_id);
            return [...filtered, entry];
          });
          _scheduleTypingExpiry(ev.user_id, false);
          break;
        }

        case 'stop_typing':
          setTypingInGroup(prev => prev.filter(e => e.userId !== ev.user_id));
          setTypingInDM(prev => {
            const next = { ...prev };
            delete next[ev.user_id];
            return next;
          });
          break;

        default:
          break;
      }
    });

    const init = async () => {
      try {
        const token = await _doJoin(user.nickname);
        tokenRef.current = token;

        // Llaves E2E: cargar o generar, guardar en almacenamiento cifrado y
        // registrar la pública en el servidor ANTES de conectar el WS (para que
        // otros usuarios puedan cifrarnos DMs desde el primer momento).
        let kp = await loadKeyPair();
        if (!kp) {
          kp = generateKeyPair();
          await saveKeyPair(kp);
        }
        myKeyPairRef.current = kp;
        try {
          await chatApiService.registerPublicKey(token, kp.publicKey);
        } catch (keyErr) {
          console.log('[Chat] No se pudo registrar la llave pública:', (keyErr as Error).message);
        }

        socket.connect(token);
      } catch (e) {
        if (mounted) setJoinError((e as Error).message);
      }
    };

    init();

    return () => {
      mounted = false;
      socket.disconnect();
      socketRef.current = null;
      Object.values(typingTimers.current).forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.nickname]);

  const sendGroupMessage = useCallback((content: string, ttl?: number) => {
    const key = groupKeyRef.current;
    const payload = key ? encryptGroup(content, key) : content;
    if (payload.length > MAX_CONTENT_LEN) {
      showToast({ type: 'warning', title: 'Mensaje demasiado largo', subtitle: 'Acórtalo e intenta de nuevo.' });
      return;
    }
    socketRef.current?.sendGroupMessage(payload, ttl);
  }, []);

  const sendDM = useCallback((toId: string, content: string, ttl?: number) => {
    if (!chatUser) return;

    // Ciframos si el destinatario tiene llave pública; si no la tiene (cliente
    // sin cifrado), enviamos texto plano para mantener compatibilidad.
    const recipientKey = userPublicKeysRef.current[toId];
    const mySecret = myKeyPairRef.current?.secretKey;
    const payload = (recipientKey && mySecret)
      ? encryptDM(content, recipientKey, mySecret)
      : content;

    if (payload.length > MAX_CONTENT_LEN) {
      showToast({ type: 'warning', title: 'Mensaje demasiado largo', subtitle: 'Acórtalo e intenta de nuevo.' });
      return;
    }

    // Inserción optimista en TEXTO PLANO: no podemos descifrar nuestro propio
    // DM, así que mostramos el original localmente e ignoramos el eco.
    const optimistic: ChatMessage = {
      id: `opt_${Date.now()}`,
      sender_id: chatUser.id,
      sender_nickname: chatUser.nickname,
      content,
      type: 'dm',
      recipient_id: toId,
      timestamp: new Date().toISOString(),
      ttl: ttl ?? null,
      expires_at: null,
      allow_read_receipt: true,
      media: null,
    };
    setDirectMessages(prev => ({
      ...prev,
      [toId]: [...(prev[toId] ?? []), optimistic],
    }));
    socketRef.current?.sendDM(toId, payload, ttl);
  }, [chatUser]);

  const sendTypingGroup = useCallback(() => {
    socketRef.current?.sendTyping();
  }, []);

  const sendTypingDM = useCallback((toId: string) => {
    socketRef.current?.sendTyping(toId);
  }, []);

  const sendStopTyping = useCallback(() => {
    socketRef.current?.sendStopTyping();
  }, []);

  const markRead = useCallback((messageId: string) => {
    socketRef.current?.markRead(messageId);
  }, []);

  const value = useMemo<ChatContextValue>(() => ({
    connected,
    chatUser,
    onlineUsers,
    groupMessages,
    directMessages,
    typingInGroup,
    typingInDM,
    sendGroupMessage,
    sendDM,
    sendTypingGroup,
    sendTypingDM,
    sendStopTyping,
    markRead,
    joinError,
  }), [
    connected, chatUser, onlineUsers, groupMessages, directMessages,
    typingInGroup, typingInDM, sendGroupMessage, sendDM, sendTypingGroup,
    sendTypingDM, sendStopTyping, markRead, joinError,
  ]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext debe usarse dentro de <ChatProvider>');
  return ctx;
}
