export interface AIModel {
    id: string;
    name: string;
    provider: string;
    type: string;
    status: "active" | "inactive";
    performance: number;
    costPerQuery: string;
    apiKey: string;
}

export interface AiProvider {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
    is_active: boolean;
    auth_requirements: Record<string, any> | null;
    available_models: string[] | null;
    default_parameters: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface AiModelConfig {
    id: number;
    ai_provider_id: number;
    name: string;
    model_id: string;
    type: string | null;
    is_active: boolean;
    credentials: Record<string, any> | null;
    parameters: Record<string, any> | null;
    system_prompt: string | null;
    cost_per_query: number;
    performance_score: number;
    created_at: string;
    updated_at: string;
    provider?: AiProvider;
} 