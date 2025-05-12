import axios from "axios";
import { AiProvider, AiProviderConfig } from "@/types/ai";
import { getAuthHeaders } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Get all provider configurations
 * @returns Promise with array of provider configurations
 */
export const getAiProviderConfigs = async (): Promise<AiProviderConfig[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/ai-provider-configs`,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching provider configurations:", error);
    throw error;
  }
};

/**
 * Get provider configurations by provider ID
 * @param providerId Provider ID
 * @returns Promise with array of provider configurations
 */
export const getAiProviderConfigsByProvider = async (
  providerId: number
): Promise<AiProviderConfig[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/ai-provider-configs?provider_id=${providerId}`,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching provider configurations for provider ${providerId}:`, error);
    throw error;
  }
};

/**
 * Get a provider configuration by ID
 * @param id Configuration ID
 * @returns Promise with provider configuration
 */
export const getAiProviderConfig = async (id: number): Promise<AiProviderConfig> => {
  try {
    const response = await axios.get(
      `${API_URL}/ai-provider-configs/${id}`,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching provider configuration with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new provider configuration
 * @param config Provider configuration data
 * @returns Promise with created provider configuration
 */
export const createAiProviderConfig = async (
  config: Partial<AiProviderConfig>
): Promise<AiProviderConfig> => {
  try {
    const response = await axios.post(
      `${API_URL}/ai-provider-configs`,
      config,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating provider configuration:", error);
    throw error;
  }
};

/**
 * Update a provider configuration
 * @param id Configuration ID
 * @param config Provider configuration data
 * @returns Promise with updated provider configuration
 */
export const updateAiProviderConfig = async (
  id: number,
  config: Partial<AiProviderConfig>
): Promise<AiProviderConfig> => {
  try {
    const response = await axios.put(
      `${API_URL}/ai-provider-configs/${id}`,
      config,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating provider configuration with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a provider configuration
 * @param id Configuration ID
 * @returns Promise with success status
 */
export const deleteAiProviderConfig = async (id: number): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/ai-provider-configs/${id}`,
      getAuthHeaders()
    );
  } catch (error) {
    console.error(`Error deleting provider configuration with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Set a provider configuration as active
 * @param id Configuration ID
 * @returns Promise with updated provider configuration
 */
export const setAiProviderConfigActive = async (id: number): Promise<AiProviderConfig> => {
  try {
    const response = await axios.post(
      `${API_URL}/ai-provider-configs/${id}/set-active`,
      {},
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error setting provider configuration ${id} as active:`, error);
    throw error;
  }
};

/**
 * Test a provider configuration
 * @param id Configuration ID
 * @param query Test query
 * @param apiKey Optional API key
 * @param options Optional test options
 * @returns Promise with test result
 */
export const testAiProviderConfig = async (
  id: number,
  query: string,
  apiKey?: string,
  options?: Record<string, any>
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/ai-provider-configs/${id}/test`,
      {
        query,
        api_key: apiKey,
        options,
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(`Error testing provider configuration with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new provider with configuration
 * @param provider Provider data
 * @param config Configuration data
 * @returns Promise with created provider and configuration
 */
export const createProviderWithConfig = async (
  provider: Partial<AiProvider>,
  config: Partial<AiProviderConfig>
): Promise<{ provider: AiProvider; config: AiProviderConfig }> => {
  try {
    const response = await axios.post(
      `${API_URL}/ai-provider-configs/create-with-provider`,
      {
        provider,
        config,
      },
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating provider with configuration:", error);
    throw error;
  }
};

/**
 * Get default templates for common providers
 * @returns Promise with default templates
 */
export const getDefaultTemplates = async (): Promise<Record<string, any>> => {
  try {
    const response = await axios.get(
      `${API_URL}/ai-provider-configs/default-templates`,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching default templates:", error);
    throw error;
  }
};
