import axios from "axios";
import { AiProvider, AiModelConfig } from "@/types/ai";

const API_URL = "http://localhost:8000/api";

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

// AI Providers API
export const getAiProviders = async (): Promise<AiProvider[]> => {
    const response = await axios.get(`${API_URL}/ai-providers`, getAuthHeaders());
    return response.data.data;
};

export const getAiProvider = async (id: string): Promise<AiProvider> => {
    const response = await axios.get(`${API_URL}/ai-providers/${id}`, getAuthHeaders());
    return response.data.data;
};

export const createAiProvider = async (providerData: Partial<AiProvider>): Promise<AiProvider> => {
    const response = await axios.post(`${API_URL}/ai-providers`, providerData, getAuthHeaders());
    return response.data.data;
};

export const updateAiProvider = async (id: string, providerData: Partial<AiProvider>): Promise<AiProvider> => {
    const response = await axios.put(`${API_URL}/ai-providers/${id}`, providerData, getAuthHeaders());
    return response.data.data;
};

export const deleteAiProvider = async (id: string): Promise<boolean> => {
    await axios.delete(`${API_URL}/ai-providers/${id}`, getAuthHeaders());
    return true;
};

// AI Model Configs API
export const getAiModelConfigs = async (providerId?: string): Promise<AiModelConfig[]> => {
    const url = providerId
        ? `${API_URL}/ai-model-configs?provider_id=${providerId}`
        : `${API_URL}/ai-model-configs`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data.data;
};

export const getAiModelConfig = async (id: string): Promise<AiModelConfig> => {
    const response = await axios.get(`${API_URL}/ai-model-configs/${id}`, getAuthHeaders());
    return response.data.data;
};

export const createAiModelConfig = async (modelData: Partial<AiModelConfig>): Promise<AiModelConfig> => {
    const response = await axios.post(`${API_URL}/ai-model-configs`, modelData, getAuthHeaders());
    return response.data.data;
};

export const updateAiModelConfig = async (id: string, modelData: Partial<AiModelConfig>): Promise<AiModelConfig> => {
    const response = await axios.put(`${API_URL}/ai-model-configs/${id}`, modelData, getAuthHeaders());
    return response.data.data;
};

export const deleteAiModelConfig = async (id: string): Promise<boolean> => {
    await axios.delete(`${API_URL}/ai-model-configs/${id}`, getAuthHeaders());
    return true;
};

export const toggleAiModelConfigActive = async (id: string): Promise<{ id: string, is_active: boolean }> => {
    const response = await axios.post(`${API_URL}/ai-model-configs/${id}/toggle-active`, {}, getAuthHeaders());
    return response.data.data;
};

export const testAiModel = async (id: string, query: string, testParameters?: Record<string, any>) => {
    const response = await axios.post(
        `${API_URL}/ai-model-configs/${id}/test`,
        { query, test_parameters: testParameters },
        getAuthHeaders()
    );
    return response.data.data;
}; 