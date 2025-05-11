/**
 * WebComponent.ts
 * 
 * This file defines a Web Component (Custom Element) for the chat widget
 * using Shadow DOM for style isolation.
 */

class ChatWidgetElement extends HTMLElement {
    private shadow: ShadowRoot;
    private iframe: HTMLIFrameElement | null = null;
    
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
      // Get attributes
      const widgetUrl = this.getAttribute('widget-url') || 'https://chat-widget.example.com/widget';
      const widgetId = this.getAttribute('widget-id') || 'default';
      const primaryColor = this.getAttribute('primary-color') || '#D39931';
      const position = this.getAttribute('position') || 'bottom-right';
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: block;
          width: auto;
          height: auto;
        }
        .widget-container {
          width: 100%;
          height: 100%;
        }
        iframe {
          border: none;
          width: 100%;
          height: 100%;
          background: transparent;
        }
      `;
      
      // Create iframe
      this.iframe = document.createElement('iframe');
      this.iframe.src = widgetUrl;
      this.iframe.title = 'AI Chat Widget';
      this.iframe.setAttribute('loading', 'lazy');
      
      // Create container
      const container = document.createElement('div');
      container.className = 'widget-container';
      container.appendChild(this.iframe);
      
      // Add to shadow DOM
      this.shadow.appendChild(style);
      this.shadow.appendChild(container);
      
      // Set up message listener
      window.addEventListener('message', this.handleMessage.bind(this));
    }
    
    disconnectedCallback() {
      window.removeEventListener('message', this.handleMessage.bind(this));
    }
    
    private handleMessage(event: MessageEvent) {
      // Handle messages from the iframe
      const { type, data } = event.data || {};
      
      switch (type) {
        case 'resize':
          this.handleResize(data);
          break;
        default:
          break;
      }
    }
    
    private handleResize(dimensions: { width?: number; height?: number }) {
      if (!dimensions) return;
      
      if (dimensions.width) {
        this.style.width = `${dimensions.width}px`;
      }
      
      if (dimensions.height) {
        this.style.height = `${dimensions.height}px`;
      }
    }
  }
  
  // Register the custom element
  customElements.define('ai-chat-widget', ChatWidgetElement);
  