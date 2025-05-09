/**
 * AI Routing Service
 * 
 * This service analyzes incoming queries and determines the appropriate AI model
 * to use based on context rules and configuration.
 */

interface AIModel {
    id: string;
    name: string;
    provider: string;
    type: string;
    capabilities: string[];
    contextTypes: string[];
    maxTokens: number;
    apiEndpoint: string;
  }
  
  interface RoutingRule {
    id: string;
    name: string;
    priority: number;
    conditions: RuleCondition[];
    targetModel: string;
    active: boolean;
  }
  
  interface RuleCondition {
    type: 'keyword' | 'intent' | 'length' | 'language' | 'sentiment' | 'custom';
    operator: 'contains' | 'not_contains' | 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'matches_regex';
    value: string | number | RegExp;
    field?: string;
  }
  
  interface RoutingContext {
    message: string;
    conversationId?: string;
    userId?: string;
    previousMessages?: Array<{ content: string; sender: 'user' | 'ai' }>;
    metadata?: Record<string, any>;
    language?: string;
  }
  
  interface RoutingResult {
    modelId: string;
    confidence: number;
    rule?: RoutingRule;
    fallback: boolean;
  }
  
  class AIRoutingService {
    private models: AIModel[] = [];
    private rules: RoutingRule[] = [];
    private defaultModelId: string = '';
    
    /**
     * Initialize the routing service with models and rules
     */
    public init(models: AIModel[], rules: RoutingRule[], defaultModelId: string): void {
      this.models = models;
      this.rules = rules.sort((a, b) => b.priority - a.priority); // Sort by priority (highest first)
      this.defaultModelId = defaultModelId;
    }
    
    /**
     * Route a message to the appropriate AI model
     */
    public routeMessage(context: RoutingContext): RoutingResult {
      // If no models or rules are configured, use default
      if (this.models.length === 0 || this.rules.length === 0) {
        return {
          modelId: this.defaultModelId,
          confidence: 1,
          fallback: true
        };
      }
      
      // Check each rule in priority order
      for (const rule of this.rules) {
        // Skip inactive rules
        if (!rule.active) continue;
        
        // Check if all conditions match
        const allConditionsMatch = rule.conditions.every(condition => 
          this.evaluateCondition(condition, context)
        );
        
        if (allConditionsMatch) {
          return {
            modelId: rule.targetModel,
            confidence: 0.9, // High confidence since rule matched exactly
            rule,
            fallback: false
          };
        }
      }
      
      // No rules matched, use default model
      return {
        modelId: this.defaultModelId,
        confidence: 0.5,
        fallback: true
      };
    }
    
    /**
     * Evaluate a single condition against the context
     */
    private evaluateCondition(condition: RuleCondition, context: RoutingContext): boolean {
      switch (condition.type) {
        case 'keyword':
          return this.evaluateKeywordCondition(condition, context.message);
          
        case 'intent':
          // In a real implementation, this would use NLP to detect intent
          // For now, we'll use a simple keyword-based approach
          return this.evaluateKeywordCondition(condition, context.message);
          
        case 'length':
          return this.evaluateLengthCondition(condition, context.message);
          
        case 'language':
          return this.evaluateLanguageCondition(condition, context.language || 'en');
          
        case 'sentiment':
          // In a real implementation, this would use sentiment analysis
          // For now, we'll return true as a placeholder
          return true;
          
        case 'custom':
          // Custom conditions would be evaluated based on the field and operator
          if (condition.field && condition.field in context.metadata!) {
            return this.evaluateCustomCondition(condition, context.metadata![condition.field]);
          }
          return false;
          
        default:
          return false;
      }
    }
    
    /**
     * Evaluate a keyword condition
     */
    private evaluateKeywordCondition(condition: RuleCondition, text: string): boolean {
      const normalizedText = text.toLowerCase();
      const value = String(condition.value).toLowerCase();
      
      switch (condition.operator) {
        case 'contains':
          return normalizedText.includes(value);
        case 'not_contains':
          return !normalizedText.includes(value);
        case 'equals':
          return normalizedText === value;
        case 'not_equals':
          return normalizedText !== value;
        case 'matches_regex':
          return new RegExp(value).test(normalizedText);
        default:
          return false;
      }
    }
    
    /**
     * Evaluate a length condition
     */
    private evaluateLengthCondition(condition: RuleCondition, text: string): boolean {
      const length = text.length;
      const value = Number(condition.value);
      
      switch (condition.operator) {
        case 'equals':
          return length === value;
        case 'not_equals':
          return length !== value;
        case 'greater_than':
          return length > value;
        case 'less_than':
          return length < value;
        default:
          return false;
      }
    }
    
    /**
     * Evaluate a language condition
     */
    private evaluateLanguageCondition(condition: RuleCondition, language: string): boolean {
      const value = String(condition.value).toLowerCase();
      const normalizedLanguage = language.toLowerCase();
      
      switch (condition.operator) {
        case 'equals':
          return normalizedLanguage === value;
        case 'not_equals':
          return normalizedLanguage !== value;
        case 'contains':
          return normalizedLanguage.includes(value);
        case 'not_contains':
          return !normalizedLanguage.includes(value);
        default:
          return false;
      }
    }
    
    /**
     * Evaluate a custom condition
     */
    private evaluateCustomCondition(condition: RuleCondition, value: any): boolean {
      const conditionValue = condition.value;
      
      switch (condition.operator) {
        case 'equals':
          return value === conditionValue;
        case 'not_equals':
          return value !== conditionValue;
        case 'contains':
          return String(value).includes(String(conditionValue));
        case 'not_contains':
          return !String(value).includes(String(conditionValue));
        case 'greater_than':
          return Number(value) > Number(conditionValue);
        case 'less_than':
          return Number(value) < Number(conditionValue);
        case 'matches_regex':
          return new RegExp(String(conditionValue)).test(String(value));
        default:
          return false;
      }
    }
    
    /**
     * Get all available AI models
     */
    public getModels(): AIModel[] {
      return this.models;
    }
    
    /**
     * Get all routing rules
     */
    public getRules(): RoutingRule[] {
      return this.rules;
    }
    
    /**
     * Add or update a routing rule
     */
    public setRule(rule: RoutingRule): void {
      const index = this.rules.findIndex(r => r.id === rule.id);
      
      if (index >= 0) {
        // Update existing rule
        this.rules[index] = rule;
      } else {
        // Add new rule
        this.rules.push(rule);
      }
      
      // Re-sort rules by priority
      this.rules.sort((a, b) => b.priority - a.priority);
    }
    
    /**
     * Delete a routing rule
     */
    public deleteRule(ruleId: string): boolean {
      const initialLength = this.rules.length;
      this.rules = this.rules.filter(rule => rule.id !== ruleId);
      return this.rules.length < initialLength;
    }
    
    /**
     * Set the default model ID
     */
    public setDefaultModel(modelId: string): void {
      this.defaultModelId = modelId;
    }
  }
  
  // Create a singleton instance
  const aiRoutingService = new AIRoutingService();
  
  export default aiRoutingService;
  