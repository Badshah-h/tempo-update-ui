import { routeMessage, testRoutingRule } from "./aiModelService";

/**
 * AI Routing Service
 *
 * This service analyzes incoming queries and determines the appropriate AI model
 * to use based on context rules and configuration.
 */

export interface AIModel {
  id: number;
  name: string;
  provider: string;
  type: string;
  capabilities: string[];
  contextTypes: string[];
  maxTokens: number;
  apiEndpoint: string;
}

export interface RoutingRule {
  id: number;
  name: string;
  priority: number;
  conditions: RuleCondition[];
  targetModel: string;
  active: boolean;
}

export interface RuleCondition {
  type: "keyword" | "intent" | "length" | "language" | "sentiment" | "custom";
  operator:
    | "contains"
    | "not_contains"
    | "equals"
    | "not_equals"
    | "greater_than"
    | "less_than"
    | "matches_regex";
  value: string | number | RegExp;
  field?: string;
}

export interface RoutingContext {
  message: string;
  conversationId?: string;
  userId?: string;
  previousMessages?: Array<{ content: string; sender: "user" | "ai" }>;
  metadata?: Record<string, any>;
  language?: string;
}

export interface RoutingResult {
  modelId: string | number;
  confidence: number;
  rule?: RoutingRule;
  fallback: boolean;
}

/**
 * Route a message to the appropriate AI model using the backend API
 */
export const routeMessageToModel = async (
  context: RoutingContext,
): Promise<RoutingResult> => {
  try {
    const result = await routeMessage(context.message, {
      conversationId: context.conversationId,
      userId: context.userId,
      previousMessages: context.previousMessages,
      metadata: context.metadata,
      language: context.language,
    });

    return {
      modelId: result.model_id,
      confidence: result.confidence,
      rule: result.rule_id
        ? ({ id: result.rule_id } as RoutingRule)
        : undefined,
      fallback: result.fallback,
    };
  } catch (error) {
    console.error("Error routing message:", error);

    // Fallback to default model
    return {
      modelId: "default",
      confidence: 0,
      fallback: true,
    };
  }
};

/**
 * Test a routing rule against a message
 */
export const testRule = async (
  ruleId: number,
  message: string,
  context: Record<string, any> = {},
): Promise<boolean> => {
  try {
    const result = await testRoutingRule(ruleId, message, context);
    return result.matches;
  } catch (error) {
    console.error(`Error testing rule ${ruleId}:`, error);
    return false;
  }
};
