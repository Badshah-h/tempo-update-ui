import { Message } from "@/types/chat";

// Mock implementation of Socket.IO client
class MockSocketIO {
  private callbacks: Record<string, Function[]> = {};
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private offlineQueue: any[] = [];
  
  constructor(private url: string) {
    console.log(`Initializing mock Socket.IO connection to ${url}`);
    this.connect();
    
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }
  
  connect(): void {
    console.log("Attempting to connect...");
    
    // Simulate connection delay
    setTimeout(() => {
      if (navigator.onLine && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.connected = true;
        console.log("Socket connected successfully");
        this.emit('_internal_connected', {});
        this.processOfflineQueue();
      } else {
        this.connected = false;
        console.log("Socket connection failed");
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`Reconnect attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts}`);
          setTimeout(() => this.connect(), 2000);
        } else {
          console.log("Max reconnect attempts reached");
          this.emit('_internal_connection_failed', {});
        }
      }
    }, 1000);
  }
  
  on(event: string, callback: Function): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }
  
  off(event: string, callback?: Function): void {
    if (!callback) {
      delete this.callbacks[event];
    } else if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }
  
  emit(event: string, data: any): void {
    if (!this.connected && event !== '_internal_connected' && event !== '_internal_connection_failed') {
      console.log(`Socket not connected, queueing event: ${event}`);
      this.offlineQueue.push({ event, data });
      return;
    }
    
    console.log(`Emitting event: ${event}`, data);
    
    // For mock purposes, we'll simulate receiving a response
    if (event === 'chat_message') {
      setTimeout(() => {
        this.simulateResponse(data);
      }, 1500);
    }
  }
  
  private simulateResponse(data: any): void {
    if (this.callbacks['message']) {
      const response = {
        id: `resp-${Date.now()}`,
        content: `This is a simulated response to: "${data.content.substring(0, 20)}..."`,
        sender: 'ai',
        timestamp: new Date(),
        metadata: {
          source: 'mock-socket-io',
          confidence: 0.92
        }
      };
      
      this.callbacks['message'].forEach(callback => callback(response));
    }
  }
  
  private handleOffline(): void {
    console.log("Device went offline");
    this.connected = false;
    this.emit('_internal_disconnected', { reason: 'network_offline' });
  }
  
  private handleOnline(): void {
    console.log("Device came online");
    if (!this.connected) {
      this.reconnectAttempts = 0;
      this.connect();
    }
  }
  
  private processOfflineQueue(): void {
    if (this.offlineQueue.length > 0) {
      console.log(`Processing offline queue (${this.offlineQueue.length} items)`);
      
      const queue = [...this.offlineQueue];
      this.offlineQueue = [];
      
      queue.forEach(item => {
        this.emit(item.event, item.data);
      });
    }
  }
  
  disconnect(): void {
    console.log("Disconnecting socket");
    this.connected = false;
  }
  
  isConnected(): boolean {
    return this.connected;
  }
}

/**
 * Service for handling real-time communication
 */
export class SocketService {
  private socket: MockSocketIO | null = null;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private statusCallbacks: ((status: 'connected' | 'disconnected' | 'connecting' | 'error') => void)[] = [];
  private typingCallbacks: ((isTyping: boolean) => void)[] = [];
  private status: 'connected' | 'disconnected' | 'connecting' | 'error' = 'disconnected';
  
  /**
   * Initialize the socket connection
   */
  initialize(url: string = 'https://api.example.com/chat'): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    
    this.updateStatus('connecting');
    this.socket = new MockSocketIO(url);
    
    this.socket.on('_internal_connected', () => {
      this.updateStatus('connected');
    });
    
    this.socket.on('_internal_disconnected', () => {
      this.updateStatus('disconnected');
    });
    
    this.socket.on('_internal_connection_failed', () => {
      this.updateStatus('error');
    });
    
    this.socket.on('message', (message: Message) => {
      this.messageCallbacks.forEach(callback => callback(message));
    });
    
    this.socket.on('typing', (data: { isTyping: boolean }) => {
      this.typingCallbacks.forEach(callback => callback(data.isTyping));
    });
  }
  
  /**
   * Send a message through the socket
   */
  sendMessage(message: Message): void {
    if (!this.socket) {
      console.error("Socket not initialized");
      return;
    }
    
    this.socket.emit('chat_message', message);
  }
  
  /**
   * Send typing indicator
   */
  sendTypingIndicator(isTyping: boolean): void {
    if (!this.socket) {
      return;
    }
    
    this.socket.emit('typing', { isTyping });
  }
  
  /**
   * Register a callback for incoming messages
   */
  onMessage(callback: (message: Message) => void): () => void {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Register a callback for connection status changes
   */
  onStatusChange(callback: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void): () => void {
    this.statusCallbacks.push(callback);
    // Immediately call with current status
    callback(this.status);
    
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Register a callback for typing indicators
   */
  onTypingIndicator(callback: (isTyping: boolean) => void): () => void {
    this.typingCallbacks.push(callback);
    return () => {
      this.typingCallbacks = this.typingCallbacks.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Update the connection status and notify listeners
   */
  private updateStatus(status: 'connected' | 'disconnected' | 'connecting' | 'error'): void {
    this.status = status;
    this.statusCallbacks.forEach(callback => callback(status));
  }
  
  /**
   * Get the current connection status
   */
  getStatus(): 'connected' | 'disconnected' | 'connecting' | 'error' {
    return this.status;
  }
  
  /**
   * Disconnect the socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.updateStatus('disconnected');
  }
}

// Export a singleton instance
export const socketService = new SocketService();
