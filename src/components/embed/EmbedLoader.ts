/**
 * Lightweight loader for the AI Chat Widget
 * This file is compiled and minified to be used as the initial loader script
 * that gets embedded on customer websites.
 */

interface ChatWidgetConfig {
    widgetId: string;
    theme?: 'light' | 'dark' | 'system';
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    autoOpen?: boolean;
    hideOnMobile?: boolean;
    bubbleStyle?: string;
    borderRadius?: number;
    spacing?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    width?: number;
    height?: number;
    aiModel?: string;
    autoOpenTriggers?: {
      timeDelay?: number;
      scrollPercentage?: number;
      exitIntent?: boolean;
    };
    accessibilityLevel?: string;
    highContrast?: boolean;
    largeText?: boolean;
    screenReaderOptimized?: boolean;
    secureMessaging?: boolean;
    allowedOrigins?: string[];
    offlineMessage?: string;
    soundEnabled?: boolean;
    apiKey?: string;
  }

  // Define window.aiChat for TypeScript
  interface Window {
    aiChat: (command: string, ...args: any[]) => void;
  }
  
  class ChatWidgetLoader {
    private config: ChatWidgetConfig;
    private container: HTMLElement | null = null;
    private iframe: HTMLIFrameElement | null = null;
    private webComponent: HTMLElement | null = null;
    private initialized = false;
    private queue: any[] = [];
    private baseUrl = 'https://chat.example.com';
    private version = '1.0.0';
    
    constructor() {
      this.config = {
        widgetId: 'default',
        theme: 'system',
        position: 'bottom-right',
        autoOpen: false,
        hideOnMobile: false,
      };
      
      // Listen for messages from the iframe
      window.addEventListener('message', this.handleMessage.bind(this));
    }
    
    /**
     * Initialize the widget with configuration
     */
    init(config: ChatWidgetConfig): void {
      this.config = { ...this.config, ...config };
      
      // Check if we should hide on mobile
      if (this.config.hideOnMobile && this.isMobileDevice()) {
        console.log('AI Chat Widget: Hidden on mobile devices');
        return;
      }
      
      // Create container if it doesn't exist
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'ai-chat-widget-container';
        this.container.setAttribute('data-version', this.version);
        document.body.appendChild(this.container);
      }
      
      // Load the widget based on the embed type
      this.loadWidget();
      
      // Process any queued commands
      this.processQueue();
      
      // Set up auto-open triggers if configured
      if (this.config.autoOpen) {
        this.setupAutoOpenTriggers();
      }
      
      this.initialized = true;
    }
    
    /**
     * Load the widget based on configuration
     */
    private loadWidget(): void {
      // Clear existing content
      if (this.container) {
        this.container.innerHTML = '';
      }
      
      // Create the iframe
      this.iframe = document.createElement('iframe');
      this.iframe.style.border = 'none';
      this.iframe.style.position = 'fixed';
      this.iframe.style.width = '60px';
      this.iframe.style.height = '60px';
      this.iframe.style.overflow = 'hidden';
      this.iframe.style.zIndex = '999999';
      this.iframe.style.transition = 'all 0.3s ease';
      this.iframe.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      this.iframe.style.borderRadius = '50%';
      
      // Set position based on config
      switch (this.config.position) {
        case 'bottom-right':
          this.iframe.style.bottom = '20px';
          this.iframe.style.right = '20px';
          break;
        case 'bottom-left':
          this.iframe.style.bottom = '20px';
          this.iframe.style.left = '20px';
          break;
        case 'top-right':
          this.iframe.style.top = '20px';
          this.iframe.style.right = '20px';
          break;
        case 'top-left':
          this.iframe.style.top = '20px';
          this.iframe.style.left = '20px';
          break;
      }
      
      // Build the URL with configuration parameters
      const url = new URL(`${this.baseUrl}/embed/${this.config.widgetId}`);
      url.searchParams.append('theme', this.config.theme || 'system');
      url.searchParams.append('position', this.config.position || 'bottom-right');
      
      if (this.config.autoOpen) {
        url.searchParams.append('autoOpen', 'true');
      }
      
      if (this.config.bubbleStyle) {
        url.searchParams.append('bubbleStyle', this.config.bubbleStyle);
      }
      
      if (this.config.borderRadius) {
        url.searchParams.append('borderRadius', this.config.borderRadius.toString());
      }
      
      if (this.config.spacing) {
        url.searchParams.append('spacing', this.config.spacing);
      }
      
      if (this.config.primaryColor) {
        url.searchParams.append('primaryColor', encodeURIComponent(this.config.primaryColor));
      }
      
      if (this.config.secondaryColor) {
        url.searchParams.append('secondaryColor', encodeURIComponent(this.config.secondaryColor));
      }
      
      if (this.config.fontFamily) {
        url.searchParams.append('fontFamily', encodeURIComponent(this.config.fontFamily));
      }
      
      if (this.config.width) {
        url.searchParams.append('width', this.config.width.toString());
      }
      
      if (this.config.height) {
        url.searchParams.append('height', this.config.height.toString());
      }
      
      if (this.config.aiModel) {
        url.searchParams.append('aiModel', this.config.aiModel);
      }
      
      // Set iframe src
      this.iframe.src = url.toString();
      
      // Add accessibility attributes
      this.iframe.setAttribute('title', 'AI Chat Assistant');
      this.iframe.setAttribute('aria-label', 'Chat widget');
      this.iframe.setAttribute('role', 'complementary');
      this.iframe.setAttribute('aria-live', 'polite');
      
      // Append to container
      if (this.container) {
        this.container.appendChild(this.iframe);
      }
    }
    
    /**
     * Handle messages from the iframe
     */
    private handleMessage(event: MessageEvent): void {
      // Verify origin for security
      if (event.origin !== this.baseUrl) {
        // Check if we have allowed origins and if the origin is in the list
        if (this.config.allowedOrigins && this.config.allowedOrigins.length > 0) {
          if (!this.config.allowedOrigins.includes(event.origin)) {
            console.warn(`AI Chat Widget: Received message from unauthorized origin: ${event.origin}`);
            return;
          }
        }
      }
      
      // Process the message
      const { action, data } = event.data;
      
      switch (action) {
        case 'resize':
          this.resizeWidget(data.width, data.height);
          break;
        case 'open':
          this.openWidget();
          break;
        case 'close':
          this.closeWidget();
          break;
        case 'ready':
          this.sendConfig();
          break;
      }
    }
    
    /**
     * Resize the widget iframe
     */
    private resizeWidget(width: string | number, height: string | number): void {
      if (this.iframe) {
        this.iframe.style.width = typeof width === 'number' ? `${width}px` : width;
        this.iframe.style.height = typeof height === 'number' ? `${height}px` : height;
        this.iframe.style.borderRadius = width === 60 ? '50%' : '16px';
      }
    }
    
    /**
     * Open the widget
     */
    openWidget(): void {
      if (this.iframe) {
        this.iframe.contentWindow?.postMessage({ action: 'open' }, this.baseUrl);
        this.resizeWidget(this.config.width || 350, this.config.height || 500);
      }
    }
    
    /**
     * Close the widget
     */
    closeWidget(): void {
      if (this.iframe) {
        this.iframe.contentWindow?.postMessage({ action: 'close' }, this.baseUrl);
        this.resizeWidget(60, 60);
      }
    }
    
    /**
     * Send configuration to the iframe
     */
    private sendConfig(): void {
      if (this.iframe) {
        this.iframe.contentWindow?.postMessage({
          action: 'config',
          data: this.config
        }, this.baseUrl);
      }
    }
    
    /**
     * Set up auto-open triggers based on configuration
     */
    private setupAutoOpenTriggers(): void {
      const triggers = this.config.autoOpenTriggers || {};
      
      // Time delay trigger
      if (triggers.timeDelay) {
        setTimeout(() => {
          this.openWidget();
        }, triggers.timeDelay);
      }
      
      // Scroll percentage trigger
      if (triggers.scrollPercentage) {
        const scrollHandler = () => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = document.documentElement.clientHeight;
          
          const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
          
          if (scrollPercentage >= (triggers.scrollPercentage || 50)) {
            this.openWidget();
            // Remove listener after triggering
            window.removeEventListener('scroll', scrollHandler);
          }
        };
        
        window.addEventListener('scroll', scrollHandler);
      }
      
      // Exit intent trigger
      if (triggers.exitIntent) {
        const exitIntentHandler = (e: MouseEvent) => {
          if (e.clientY <= 0) {
            this.openWidget();
            // Remove listener after triggering
            document.removeEventListener('mouseleave', exitIntentHandler);
          }
        };
        
        document.addEventListener('mouseleave', exitIntentHandler);
      }
    }
    
    /**
     * Process any queued commands
     */
    private processQueue(): void {
      while (this.queue.length > 0) {
        const item = this.queue.shift();
        if (item && item.command && typeof this[item.command] === 'function') {
          (this[item.command] as Function)(...item.args);
        }
      }
    }
    
    /**
     * Check if the current device is mobile
     */
    private isMobileDevice(): boolean {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * Queue a command to be executed when initialized
     */
    queueCommand(command: string, ...args: any[]): void {
      if (this.initialized) {
        if (typeof this[command] === 'function') {
          (this[command] as Function)(...args);
        }
      } else {
        this.queue.push({ command, args });
      }
    }
  }
  
  // Create global instance
  const aiChatWidget = new ChatWidgetLoader();
  
  // Create global function for initialization
  window.aiChat = function(command: string, ...args: any[]) {
    if (command === 'init') {
      aiChatWidget.init(args[0]);
    } else {
      aiChatWidget.queueCommand(command, ...args);
    }
  };
  