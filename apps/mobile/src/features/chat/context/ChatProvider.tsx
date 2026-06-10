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
import { chatApiService } from '../services/chatApi.service';
import { ChatSocketService } from '../services/chatSocket.service';
import { ChatMessage, ChatUser } from '../types/chat.types';

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
        case 'users_list':
          setOnlineUsers(ev.users);
          break;

        case 'group_history':
          setGroupMessages(ev.messages);
          break;

        case 'group_key':
          // empty key = plain text (our deployed instance). Nothing to do.
          break;

        case 'group_message':
          setGroupMessages(prev => {
            if (prev.some(m => m.id === ev.message.id)) return prev;
            return [...prev, ev.message];
          });
          break;

        case 'dm': {
          const otherId =
            ev.message.sender_id === chatUserIdRef.current
              ? ev.message.recipient_id!
              : ev.message.sender_id;
          setDirectMessages(prev => {
            const thread = prev[otherId] ?? [];
            if (thread.some(m => m.id === ev.message.id)) return prev;
            return { ...prev, [otherId]: [...thread, ev.message] };
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
    socketRef.current?.sendGroupMessage(content, ttl);
  }, []);

  const sendDM = useCallback((toId: string, content: string, ttl?: number) => {
    if (!chatUser) return;
    // Optimistic insert
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
    socketRef.current?.sendDM(toId, content, ttl);
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
