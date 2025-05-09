import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from '../chat/ChatWidget';
import { ChatWidgetConfig } from '@/types/chat';

// This component creates a Web Component wrapper around our React ChatWidget
export class AIChatWidget extends HTMLElement {
  private shadow: ShadowRoot;
  private mountPoint: HTMLDivElement;
  private config: Partial<ChatWidgetConfig> = {};
  
  constructor() {
    super();
    
    // Create shadow DOM
    this.shadow = this.attachShadow({ mode: 'open' });
    
    // Create mount point for React
    this.mountPoint = document.createElement('div');
    this.shadow.appendChild(this.mountPoint);
    
    // Add styles to shadow DOM
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 0;
        height: 0;
        margin: 0;
        padding: 0;
        position: relative;
        z-index: 9999;
      }
    `;
    this.shadow.appendChild(style);
  }
  
  // Observe attribute changes
  static get observedAttributes() {
    return [
      'widget-id',
      'theme',
      'position',
      'auto-open',
      'hide-on-mobile',
      'width',
      'height',
      'api-key'
    ];
  }
  
  // Handle attribute changes
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'widget-id':
        this.config.widgetId = newValue;
        break;
      case 'theme':
        this.config.theme = newValue as 'light' | 'dark' | 'system';
        break;
      case 'position':
        this.config.position = newValue as 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
        break;
      case 'auto-open':
        this.config.initiallyOpen = newValue !== null;
        break;
      case 'hide-on-mobile':
        this.config.hideOnMobile = newValue !== null;
        break;
      case 'width':
        this.config.customWidth = newValue;
        break;
      case 'height':
        this.config.customHeight = newValue;
        break;
      case 'api-key':
        this.config.apiKey = newValue;
        break;
    }
    
    this.renderComponent();
  }
  
  // When component is added to the DOM
  connectedCallback() {
    this.renderComponent();
  }
  
  // When component is removed from the DOM
  disconnectedCallback() {
    // Clean up React root
  }
  
  // Render the React component into shadow DOM
  private renderComponent() {
    const root = createRoot(this.mountPoint);
    root.render(
      <ChatWidget
        title={this.config.title}
        subtitle={this.config.subtitle}
        primaryColor={this.config.primaryColor}
        secondaryColor={this.config.secondaryColor}
        position={this.config.position || 'bottom-right'}
        initiallyOpen={this.config.initiallyOpen}
        avatarUrl={this.config.avatarUrl}
        welcomeMessage={this.config.welcomeMessage}
        suggestedQuestions={this.config.suggestedQuestions}
      />
    );
  }
}

// Register the web component
export const registerWebComponent = () => {
  if (!customElements.get('ai-chat-widget')) {
    customElements.define('ai-chat-widget', AIChatWidget);
  }
};

export default registerWebComponent;
