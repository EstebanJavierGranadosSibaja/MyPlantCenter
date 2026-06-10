import { CHAT_WS_URL } from '../config/chat.config';
import { WsEvent } from '../types/chat.types';

type EventHandler = (event: WsEvent) => void;
type StatusHandler = (connected: boolean) => void;

export class ChatSocketService {
  private ws: WebSocket | null = null;
  private token: string = '';
  private onEventCb: EventHandler | null = null;
  private onStatusCb: StatusHandler | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;

  onEvent(cb: EventHandler) {
    this.onEventCb = cb;
  }

  onStatus(cb: StatusHandler) {
    this.onStatusCb = cb;
  }

  connect(token: string) {
    this.token = token;
    this.destroyed = false;
    this._open();
  }

  disconnect() {
    this.destroyed = true;
    this._clearTimers();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.onStatusCb?.(false);
  }

  send(payload: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  sendGroupMessage(content: string, ttl?: number) {
    this.send({ type: 'group_message', content, ...(ttl ? { ttl } : {}) });
  }

  sendDM(toId: string, content: string, ttl?: number) {
    this.send({ type: 'dm', to: toId, content, ...(ttl ? { ttl } : {}) });
  }

  sendTyping(toId?: string) {
    this.send({ type: 'typing', ...(toId ? { to: toId } : {}) });
  }

  sendStopTyping() {
    this.send({ type: 'stop_typing' });
  }

  markRead(messageId: string) {
    this.send({ type: 'mark_read', message_id: messageId });
  }

  private _open() {
    if (this.destroyed) return;
    const url = `${CHAT_WS_URL}/ws/${this.token}`;
    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      if (this.destroyed) { ws.close(); return; }
      this.onStatusCb?.(true);
      this._startPing();
    };

    ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as WsEvent;
        this.onEventCb?.(event);
      } catch {
        // ignore malformed frames
      }
    };

    ws.onerror = () => {
      // onerror always fires before onclose — handle in onclose
    };

    ws.onclose = () => {
      this._clearTimers();
      this.onStatusCb?.(false);
      if (!this.destroyed) {
        this.reconnectTimer = setTimeout(() => this._open(), 4000);
      }
    };
  }

  private _startPing() {
    this._clearPing();
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 25000);
  }

  private _clearPing() {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private _clearTimers() {
    this._clearPing();
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
