/**
 * AI Chat Widget Loader
 *
 * This is a lightweight TypeScript loader that can be embedded on any website
 * to load the AI Chat Widget. It supports both iframe and Web Component implementations.
 */

/**
 * Configuration options for the AI Chat Widget
 */
export interface WidgetConfig {
  /** Unique identifier for the widget instance */
  widgetId: string;
  /** Theme preference for the widget */
  theme?: 'light' | 'dark' | 'system';
  /** Position of the widget on the page */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Whether the widget should open automatically */
  autoOpen?: boolean;
  /** Whether to hide the widget on mobile devices */
  hideOnMobile?: boolean;
  /** Width of the widget when expanded */
  width?: string | number;
  /** Height of the widget when expanded */
  height?: string | number;
  /** API key for authentication */
  apiKey?: string;
  /** Type of embedding to use */
  embedType?: 'iframe' | 'web-component';
  /** Custom CSS class to apply to the container */
  containerClass?: string;
  /** Callback when widget is loaded */
  onLoad?: () => void;
}

/**
 * Message event data structure for widget communication
 */
interface WidgetMessageEvent {
  type: string;
  width?: string;
  height?: string;
  message?: string;
}

/**
 * AI Chat Widget Loader class
 * Handles the embedding and initialization of the chat widget
 */
export class AIChatWidgetLoader {
  private config: WidgetConfig;
  private baseUrl: string;
  private container: HTMLElement | null = null;
  private iframe: HTMLIFrameElement | null = null;
  private widgetComponent: HTMLElement | null = null;

  /**
   * Create a new instance of the widget loader
   */
  constructor() {
    // Default configuration
    this.config = {
      widgetId: 'default-widget-id',
      theme: 'system',
      position: 'bottom-right',
      autoOpen: false,
      hideOnMobile: false,
      embedType: 'iframe'
    };

    // Determine base URL from script src
    const scriptElement = document.currentScript as HTMLScriptElement;
    this.baseUrl = scriptElement ? new URL(scriptElement.src).origin : 'https://chat.example.com';
  }

  /**
   * Initialize the widget with configuration
   * @param config - Configuration options for the widget
   * @returns The widget loader instance for chaining
   */
  public init(config: Partial<WidgetConfig>): AIChatWidgetLoader {
    this.config = { ...this.config, ...config };

    // Check if mobile and should be hidden
    if (this.config.hideOnMobile && this.isMobileDevice()) {
      return this;
    }

    // Create container for the widget
    this.createContainer();

    // Load the appropriate widget type
    if (this.config.embedType === 'web-component' && this.supportsWebComponents()) {
      this.loadWebComponent();
    } else {
      this.loadIframe();
    }

    return this;
  }

  /**
   * Check if the device is mobile
   * @returns True if the device is mobile
   */
  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Check if browser supports Web Components
   * @returns True if the browser supports Web Components
   */
  private supportsWebComponents(): boolean {
    return (
      'customElements' in window &&
      'attachShadow' in Element.prototype &&
      'getRootNode' in Element.prototype
    );
  }

  /**
   * Create container element for the widget
   */
  private createContainer(): void {
    // Remove existing container if present
    const existingContainer = document.getElementById('ai-chat-widget-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create new container
    this.container = document.createElement('div');
    this.container.id = 'ai-chat-widget-container';

    // Add custom class if provided
    if (this.config.containerClass) {
      this.container.className = this.config.containerClass;
    }

    document.body.appendChild(this.container);
  }

  /**
   * Load the iframe version of the widget
   */
  private loadIframe(): void {
    if (!this.container) return;

    // Create iframe element
    this.iframe = document.createElement('iframe');

    // Build URL with query parameters
    const params = new URLSearchParams();
    params.append('theme', this.config.theme || 'system');
    params.append('position', this.config.position || 'bottom-right');

    if (this.config.autoOpen) {
      params.append('autoOpen', 'true');
    }

    if (this.config.width) {
      params.append('width', String(this.config.width));
    }

    if (this.config.height) {
      params.append('height', String(this.config.height));
    }

    if (this.config.apiKey) {
      params.append('apiKey', this.config.apiKey);
    }

    this.iframe.src = `${this.baseUrl}/embed/${this.config.widgetId}?${params.toString()}`;

    // Set iframe styles
    Object.assign(this.iframe.style, {
      position: 'fixed',
      border: 'none',
      width: '60px',
      height: '60px',
      zIndex: '999999',
      overflow: 'hidden',
      borderRadius: '50%',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.3s ease'
    });

    // Set iframe attributes
    this.iframe.allow = 'microphone; camera';
    this.iframe.title = 'AI Chat Assistant';
    this.iframe.setAttribute('loading', 'lazy');
    this.iframe.setAttribute('importance', 'high');

    // Set position
    if (this.config.position?.includes('bottom')) {
      this.iframe.style.bottom = '20px';
    } else {
      this.iframe.style.top = '20px';
    }

    if (this.config.position?.includes('right')) {
      this.iframe.style.right = '20px';
    } else {
      this.iframe.style.left = '20px';
    }

    this.container.appendChild(this.iframe);

    // Set up message listener for iframe communication
    this.setupMessageListener();

    // Trigger onLoad callback if provided
    if (this.config.onLoad && typeof this.config.onLoad === 'function') {
      this.iframe.onload = this.config.onLoad;
    }
  }

  /**
   * Set up message listener for iframe communication
   */
  private setupMessageListener(): void {
    window.addEventListener('message', (event: MessageEvent<WidgetMessageEvent>) => {
      // Verify origin for security
      if (event.origin !== this.baseUrl) return;

      // Handle messages from iframe
      if (event.data && event.data.type) {
        switch (event.data.type) {
          case 'ai-chat-widget-resize':
            if (this.iframe && event.data.width && event.data.height) {
              this.iframe.style.width = event.data.width;
              this.iframe.style.height = event.data.height;

              // Update border radius when expanded
              if (event.data.width !== '60px') {
                this.iframe.style.borderRadius = '16px';
              } else {
                this.iframe.style.borderRadius = '50%';
              }
            }
            break;

          case 'ai-chat-widget-loaded':
            if (this.config.onLoad && typeof this.config.onLoad === 'function') {
              this.config.onLoad();
            }
            break;
        }
      }
    });
  }

  /**
   * Load the Web Component version of the widget
   */
  private loadWebComponent(): void {
    if (!this.container) return;

    // Load the Web Component script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = `${this.baseUrl}/embed/widget.js`;
    script.onload = () => {
      // Create the Web Component
      this.widgetComponent = document.createElement('ai-chat-widget');

      // Set attributes based on config
      this.widgetComponent.setAttribute('widget-id', this.config.widgetId);
      this.widgetComponent.setAttribute('theme', this.config.theme || 'system');
      this.widgetComponent.setAttribute('position', this.config.position || 'bottom-right');

      if (this.config.autoOpen) {
        this.widgetComponent.setAttribute('auto-open', 'true');
      }

      if (this.config.width) {
        this.widgetComponent.setAttribute('width', String(this.config.width));
      }

      if (this.config.height) {
        this.widgetComponent.setAttribute('height', String(this.config.height));
      }

      if (this.config.apiKey) {
        this.widgetComponent.setAttribute('api-key', this.config.apiKey);
      }

      this.container.appendChild(this.widgetComponent);

      // Trigger onLoad callback if provided
      if (this.config.onLoad && typeof this.config.onLoad === 'function') {
        this.config.onLoad();
      }
    };

    document.head.appendChild(script);
  }

  /**
   * Open the chat widget
   * @returns The widget loader instance for chaining
   */
  public open(): AIChatWidgetLoader {
    window.postMessage({ type: 'ai-chat-widget-open' }, '*');
    return this;
  }

  /**
   * Close the chat widget
   * @returns The widget loader instance for chaining
   */
  public close(): AIChatWidgetLoader {
    window.postMessage({ type: 'ai-chat-widget-close' }, '*');
    return this;
  }

  /**
   * Toggle the chat widget
   * @returns The widget loader instance for chaining
   */
  public toggle(): AIChatWidgetLoader {
    window.postMessage({ type: 'ai-chat-widget-toggle' }, '*');
    return this;
  }

  /**
   * Send a message to the chat widget
   * @param message - The message to send
   * @returns The widget loader instance for chaining
   */
  public sendMessage(message: string): AIChatWidgetLoader {
    window.postMessage({ type: 'ai-chat-widget-message', message }, '*');
    return this;
  }

  /**
   * Destroy the widget and remove it from the DOM
   * @returns The widget loader instance for chaining
   */
  public destroy(): AIChatWidgetLoader {
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.iframe = null;
      this.widgetComponent = null;
    }
    return this;
  }
}

// Create singleton instance
const aiChatWidget = new AIChatWidgetLoader();

// For browser usage without module system
if (typeof window !== 'undefined') {
  (window as any).aiChatWidget = aiChatWidget;
}

export default aiChatWidget;
