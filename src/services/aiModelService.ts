import axios from "axios";
import authService from "./authService";

// Define the API base URL
const API_URL = "http://localhost:8000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Types
export interface AIProvider {
  id: number;
  name: string;
  slug: string;
  description?: string;
  base_url?: string;
  logo_url?: string;
  capabilities?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIModel {
  id: number;
  provider_id: number;
  name: string;
  slug: string;
  type: string;
  capabilities?: string[];
  context_types?: string[];
  max_tokens: number;
  api_endpoint?: string;
  default_parameters?: Record<string, any>;
  system_prompt?: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  provider?: AIProvider;
}

export interface APIKey {
  id: number;
  provider_id: number;
  key_name: string;
  key_value: string;
  is_active: boolean;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  provider?: AIProvider;
}

export interface RoutingRule {
  id: number;
  name: string;
  priority: number;
  conditions: RuleCondition[];
  target_model_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  target_model?: AIModel;
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
  value: string | number;
  field?: string;
}

// AI Providers
export const getProviders = async (
  activeOnly: boolean = false,
): Promise<AIProvider[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/ai-providers?active_only=${activeOnly ? 1 : 0}`,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching providers:", error);
    throw error.response?.data || { message: "Failed to fetch providers" };
  }
};

export const getProvider = async (id: number): Promise<AIProvider> => {
  try {
    const response = await axios.get(
      `${API_URL}/ai-providers/${id}`,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching provider ${id}:`, error);
    throw error.response?.data || { message: "Failed to fetch provider" };
  }
};

export const createProvider = async (
  data: Partial<AIProvider>,
): Promise<AIProvider> => {
  try {
    const response = await axios.post(
      `${API_URL}/ai-providers`,
      data,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating provider:", error);
    throw error.response?.data || { message: "Failed to create provider" };
  }
};

export const updateProvider = async (
  id: number,
  data: Partial<AIProvider>,
): Promise<AIProvider> => {
  try {
    const response = await axios.put(
      `${API_URL}/ai-providers/${id}`,
      data,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating provider ${id}:`, error);
    throw error.response?.data || { message: "Failed to update provider" };
  }
};

export const deleteProvider = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/ai-providers/${id}`, getAuthHeaders());
    return true;
  } catch (error: any) {
    console.error(`Error deleting provider ${id}:`, error);
    throw error.response?.data || { message: "Failed to delete provider" };
  }
};

export const toggleProviderStatus = async (id: number): Promise<AIProvider> => {
  try {
    const response = await axios.put(
      `${API_URL}/ai-providers/${id}/toggle-status`,
      {},
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error toggling provider status ${id}:`, error);
    throw (
      error.response?.data || { message: "Failed to toggle provider status" }
    );
  }
};

// AI Models
export const getModels = async (
  activeOnly: boolean = false,
): Promise<AIModel[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/ai-models?active_only=${activeOnly ? 1 : 0}`,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching models:", error);
    throw error.response?.data || { message: "Failed to fetch models" };
  }
};

export const getModelsByProvider = async (
  providerId: number,
  activeOnly: boolean = false,
): Promise<AIModel[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/ai-models/provider/${providerId}?active_only=${activeOnly ? 1 : 0}`,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching models for provider ${providerId}:`, error);
    throw error.response?.data || { message: "Failed to fetch models" };
  }
};

export const getModel = async (id: number): Promise<AIModel> => {
  try {
    const response = await axios.get(
      `${API_URL}/ai-models/${id}`,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching model ${id}:`, error);
    throw error.response?.data || { message: "Failed to fetch model" };
  }
};

export const getDefaultModel = async (): Promise<AIModel> => {
  try {
    const response = await axios.get(
      `${API_URL}/ai-models/default`,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching default model:", error);
    throw error.response?.data || { message: "Failed to fetch default model" };
  }
};

export const createModel = async (data: Partial<AIModel>): Promise<AIModel> => {
  try {
    const response = await axios.post(
      `${API_URL}/ai-models`,
      data,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating model:", error);
    throw error.response?.data || { message: "Failed to create model" };
  }
};

export const updateModel = async (
  id: number,
  data: Partial<AIModel>,
): Promise<AIModel> => {
  try {
    const response = await axios.put(
      `${API_URL}/ai-models/${id}`,
      data,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating model ${id}:`, error);
    throw error.response?.data || { message: "Failed to update model" };
  }
};

export const deleteModel = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/ai-models/${id}`, getAuthHeaders());
    return true;
  } catch (error: any) {
    console.error(`Error deleting model ${id}:`, error);
    throw error.response?.data || { message: "Failed to delete model" };
  }
};

export const toggleModelStatus = async (id: number): Promise<AIModel> => {
  try {
    const response = await axios.put(
      `${API_URL}/ai-models/${id}/toggle-status`,
      {},
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error toggling model status ${id}:`, error);
    throw error.response?.data || { message: "Failed to toggle model status" };
  }
};

export const setModelAsDefault = async (id: number): Promise<AIModel> => {
  try {
    const response = await axios.put(
      `${API_URL}/ai-models/${id}/set-default`,
      {},
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error setting model as default ${id}:`, error);
    throw error.response?.data || { message: "Failed to set model as default" };
  }
};

export const testModel = async (
  id: number,
  query: string,
  options: Record<string, any> = {},
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/ai-models/${id}/test`,
      { query, options },
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error testing model ${id}:`, error);
    throw error.response?.data || { message: "Failed to test model" };
  }
};

// API Keys
export const getApiKeys = async (
  activeOnly: boolean = false,
): Promise<APIKey[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/api-keys?active_only=${activeOnly ? 1 : 0}`,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching API keys:", error);
    throw error.response?.data || { message: "Failed to fetch API keys" };
  }
};

export const getApiKeysByProvider = async (
  providerId: number,
  activeOnly: boolean = false,
): Promise<APIKey[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/api-keys/provider/${providerId}?active_only=${activeOnly ? 1 : 0}`,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching API keys for provider ${providerId}:`, error);
    throw error.response?.data || { message: "Failed to fetch API keys" };
  }
};

export const getApiKey = async (id: number): Promise<APIKey> => {
  try {
    const response = await axios.get(
      `${API_URL}/api-keys/${id}`,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching API key ${id}:`, error);
    throw error.response?.data || { message: "Failed to fetch API key" };
  }
};

export const createApiKey = async (data: Partial<APIKey>): Promise<APIKey> => {
  try {
    const response = await axios.post(
      `${API_URL}/api-keys`,
      data,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating API key:", error);
    throw error.response?.data || { message: "Failed to create API key" };
  }
};

export const updateApiKey = async (
  id: number,
  data: Partial<APIKey>,
): Promise<APIKey> => {
  try {
    const response = await axios.put(
      `${API_URL}/api-keys/${id}`,
      data,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating API key ${id}:`, error);
    throw error.response?.data || { message: "Failed to update API key" };
  }
};

export const deleteApiKey = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/api-keys/${id}`, getAuthHeaders());
    return true;
  } catch (error: any) {
    console.error(`Error deleting API key ${id}:`, error);
    throw error.response?.data || { message: "Failed to delete API key" };
  }
};

export const toggleApiKeyStatus = async (id: number): Promise<APIKey> => {
  try {
    const response = await axios.put(
      `${API_URL}/api-keys/${id}/toggle-status`,
      {},
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error toggling API key status ${id}:`, error);
    throw (
      error.response?.data || { message: "Failed to toggle API key status" }
    );
  }
};

export const validateApiKey = async (
  id: number,
): Promise<{ valid: boolean; message: string }> => {
  try {
    const response = await axios.post(
      `${API_URL}/api-keys/${id}/validate`,
      {},
      getAuthHeaders(),
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error validating API key ${id}:`, error);
    throw error.response?.data || { message: "Failed to validate API key" };
  }
};

// Routing Rules
export const getRoutingRules = async (
  activeOnly: boolean = false,
): Promise<RoutingRule[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/routing-rules?active_only=${activeOnly ? 1 : 0}`,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching routing rules:", error);
    throw error.response?.data || { message: "Failed to fetch routing rules" };
  }
};

export const getRoutingRule = async (id: number): Promise<RoutingRule> => {
  try {
    const response = await axios.get(
      `${API_URL}/routing-rules/${id}`,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching routing rule ${id}:`, error);
    throw error.response?.data || { message: "Failed to fetch routing rule" };
  }
};

export const createRoutingRule = async (
  data: Partial<RoutingRule>,
): Promise<RoutingRule> => {
  try {
    const response = await axios.post(
      `${API_URL}/routing-rules`,
      data,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating routing rule:", error);
    throw error.response?.data || { message: "Failed to create routing rule" };
  }
};

export const updateRoutingRule = async (
  id: number,
  data: Partial<RoutingRule>,
): Promise<RoutingRule> => {
  try {
    const response = await axios.put(
      `${API_URL}/routing-rules/${id}`,
      data,
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating routing rule ${id}:`, error);
    throw error.response?.data || { message: "Failed to update routing rule" };
  }
};

export const deleteRoutingRule = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/routing-rules/${id}`, getAuthHeaders());
    return true;
  } catch (error: any) {
    console.error(`Error deleting routing rule ${id}:`, error);
    throw error.response?.data || { message: "Failed to delete routing rule" };
  }
};

export const toggleRoutingRuleStatus = async (
  id: number,
): Promise<RoutingRule> => {
  try {
    const response = await axios.put(
      `${API_URL}/routing-rules/${id}/toggle-status`,
      {},
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error toggling routing rule status ${id}:`, error);
    throw (
      error.response?.data || {
        message: "Failed to toggle routing rule status",
      }
    );
  }
};

export const updateRoutingRulePriorities = async (
  ruleIds: number[],
): Promise<boolean> => {
  try {
    await axios.post(
      `${API_URL}/routing-rules/priorities`,
      { rule_ids: ruleIds },
      getAuthHeaders(),
    );
    return true;
  } catch (error: any) {
    console.error("Error updating routing rule priorities:", error);
    throw (
      error.response?.data || {
        message: "Failed to update routing rule priorities",
      }
    );
  }
};

export const testRoutingRule = async (
  id: number,
  message: string,
  context: Record<string, any> = {},
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/routing-rules/${id}/test`,
      { message, context },
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error testing routing rule ${id}:`, error);
    throw error.response?.data || { message: "Failed to test routing rule" };
  }
};

export const routeMessage = async (
  message: string,
  context: Record<string, any> = {},
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/routing-rules/route`,
      { message, context },
      getAuthHeaders(),
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error routing message:", error);
    throw error.response?.data || { message: "Failed to route message" };
  }
};
