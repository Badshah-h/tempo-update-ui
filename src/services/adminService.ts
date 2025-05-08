import { AIModel, PromptTemplate, AnalyticsData, TopQuery, Issue, RecentQuery } from "@/types/admin";
import { mockAIModels, mockModelPerformance, mockRecentQueries } from "@/mock/admin/models";
import { mockPromptTemplates, templateCategories } from "@/mock/admin/templates";
import { mockAnalyticsData, mockTopQueries, mockRecentIssues, mockUserEngagement, mockTrafficSources } from "@/mock/admin/analytics";
import { mockUsers, User } from "@/mock/admin/users";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// AI Models
export const getAIModels = async (): Promise<AIModel[]> => {
    await delay(300);
    return mockAIModels;
};

export const getAIModel = async (modelId: string): Promise<AIModel | undefined> => {
    await delay(200);
    return mockAIModels.find(model => model.id === modelId);
};

export const updateAIModel = async (modelId: string, updates: Partial<AIModel>): Promise<AIModel> => {
    await delay(300);
    const model = mockAIModels.find(m => m.id === modelId);
    if (!model) {
        throw new Error(`Model with ID ${modelId} not found`);
    }

    // In a real implementation, this would update the model in the database
    const updatedModel = { ...model, ...updates };

    return updatedModel;
};

export const getModelPerformance = async (modelId: string) => {
    await delay(400);
    return mockModelPerformance;
};

export const getRecentQueries = async (modelId: string): Promise<RecentQuery[]> => {
    await delay(300);
    return mockRecentQueries;
};

// Prompt Templates
export const getPromptTemplates = async (): Promise<PromptTemplate[]> => {
    await delay(300);
    return mockPromptTemplates;
};

export const getPromptTemplate = async (templateId: string): Promise<PromptTemplate | undefined> => {
    await delay(200);
    return mockPromptTemplates.find(template => template.id === templateId);
};

export const updatePromptTemplate = async (templateId: string, updates: Partial<PromptTemplate>): Promise<PromptTemplate> => {
    await delay(300);
    const template = mockPromptTemplates.find(t => t.id === templateId);
    if (!template) {
        throw new Error(`Template with ID ${templateId} not found`);
    }

    // In a real implementation, this would update the template in the database
    const updatedTemplate = { ...template, ...updates };

    return updatedTemplate;
};

export const getTemplateCategories = async () => {
    await delay(200);
    return templateCategories;
};

// Analytics
export const getAnalyticsData = async (period: string = "7d"): Promise<AnalyticsData> => {
    await delay(500);
    return mockAnalyticsData;
};

export const getTopQueries = async (): Promise<TopQuery[]> => {
    await delay(300);
    return mockTopQueries;
};

export const getRecentIssues = async (): Promise<Issue[]> => {
    await delay(300);
    return mockRecentIssues;
};

export const getUserEngagement = async () => {
    await delay(300);
    return mockUserEngagement;
};

export const getTrafficSources = async () => {
    await delay(300);
    return mockTrafficSources;
};

// Users
export const getUsers = async (): Promise<User[]> => {
    await delay(300);
    return mockUsers;
};

export const getCurrentUser = async (): Promise<User> => {
    await delay(200);
    return mockUsers[0]; // Return the admin user
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
    await delay(300);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }

    // In a real implementation, this would update the user in the database
    const updatedUser = { ...user, ...updates };

    return updatedUser;
};
