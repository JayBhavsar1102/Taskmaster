import { Task, User } from '../types';

type WebSocketMessage = {
  type: 'task_update' | 'task_create' | 'task_delete';
  payload: any;
};

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private subscribers: Set<(message: WebSocketMessage) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  private constructor() {
    this.connect();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private connect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const wsUrl = `ws://${window.location.hostname}:8080`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected successfully');
      this.reconnectAttempts = 0; // Reset attempts on successful connection
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.notifySubscribers(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed. Attempting to reconnect...');
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private notifySubscribers(message: WebSocketMessage) {
    this.subscribers.forEach(subscriber => subscriber(message));
  }

  public subscribe(callback: (message: WebSocketMessage) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  public sendMessage(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }
}

export const webSocketService = WebSocketService.getInstance();