import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/chat';

interface SocketServiceOptions {
  url?: string;
  path?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  auth?: Record<string, string>;
}

class SocketService {
  private socket: Socket | null = null;
  private options: SocketServiceOptions;
  private messageHandlers: ((message: Message) => void)[] = [];
  private typingHandlers: ((isTyping: boolean, userId?: string) => void)[] = [];
  private connectionHandlers: ((status: 'connected' | 'disconnected' | 'error', error?: Error) => void)[] = [];
  
  constructor(options: SocketServiceOptions = {}) {
    this.options = {
      url: 'http://localhost:8000',
      path: '/socket.io',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      ...options
    };
  }
  
  /**
   * Initialize the socket connection
   */
  public init(token?: string): void {
    if (this.socket) {
      this.disconnect();
    }
    
    this.socket = io(this.options.url!, {
      path: this.options.path,
      autoConnect: this.options.autoConnect,
      reconnection: this.options.reconnection,
      reconnectionAttempts: this.options.reconnectionAttempts,
      reconnectionDelay: this.options.reconnectionDelay,
      auth: token ? { token } : this.options.auth
    });
    
    this.setupEventListeners();
  }
  
  /**
   * Set up socket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;
    
    this.socket.on('connect', () => {
      this.notifyConnectionHandlers('connected');
    });
    
    this.socket.on('disconnect', () => {
      this.notifyConnectionHandlers('disconnected');
    });
    
    this.socket.on('connect_error', (error) => {
      this.notifyConnectionHandlers('error', error);
    });
    
    this.socket.on('message', (message: Message) => {
      this.notifyMessageHandlers(message);
    });
    
    this.socket.on('typing', ({ isTyping, userId }: { isTyping: boolean, userId?: string }) => {
      this.notifyTypingHandlers(isTyping, userId);
    });
  }
  
  /**
   * Send a message through the socket
   */
  public sendMessage(message: string, conversationId?: string): void {
    if (!this.socket || !this.socket.connected) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit('message', {
      content: message,
      conversationId,
      timestamp: new Date()
    });
  }
  
  /**
   * Send typing indicator
   */
  public sendTyping(isTyping: boolean, conversationId?: string): void {
    if (!this.socket || !this.socket.connected) return;
    
    this.socket.emit('typing', {
      isTyping,
      conversationId,
      timestamp: new Date()
    });
  }
  
  /**
   * Join a conversation room
   */
  public joinConversation(conversationId: string): void {
    if (!this.socket || !this.socket.connected) return;
    
    this.socket.emit('join', { conversationId });
  }
  
  /**
   * Leave a conversation room
   */
  public leaveConversation(conversationId: string): void {
    if (!this.socket || !this.socket.connected) return;
    
    this.socket.emit('leave', { conversationId });
  }
  
  /**
   * Register a message handler
   */
  public onMessage(handler: (message: Message) => void): () => void {
    this.messageHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }
  
  /**
   * Register a typing handler
   */
  public onTyping(handler: (isTyping: boolean, userId?: string) => void): () => void {
    this.typingHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }
  
  /**
   * Register a connection status handler
   */
  public onConnectionChange(handler: (status: 'connected' | 'disconnected' | 'error', error?: Error) => void): () => void {
    this.connectionHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }
  
  /**
   * Notify all message handlers
   */
  private notifyMessageHandlers(message: Message): void {
    this.messageHandlers.forEach(handler => handler(message));
  }
  
  /**
   * Notify all typing handlers
   */
  private notifyTypingHandlers(isTyping: boolean, userId?: string): void {
    this.typingHandlers.forEach(handler => handler(isTyping, userId));
  }
  
  /**
   * Notify all connection handlers
   */
  private notifyConnectionHandlers(status: 'connected' | 'disconnected' | 'error', error?: Error): void {
    this.connectionHandlers.forEach(handler => handler(status, error));
  }
  
  /**
   * Check if socket is connected
   */
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
  
  /**
   * Disconnect the socket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
