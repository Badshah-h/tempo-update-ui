export interface AIModel {
    id: number;
    provider_id: number;
    name: string;
    slug: string;
    type: string;
    capabilities: string[] | null;
    max_tokens: number;
    api_endpoint: string | null;
    credentials?: string | Record<string, any>;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
    provider?: AiProvider;
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

export interface AiProviderConfig {
    id: number;
    provider_id: number;
    version: string;
    auth_config: Record<string, any> | null;
    endpoints: Record<string, any> | null;
    request_templates: Record<string, any> | null;
    response_mappings: Record<string, any> | null;
    parameter_schema: Record<string, any> | null;
    stream_config: Record<string, any> | null;
    token_calculation: Record<string, any> | null;
    cost_calculation: Record<string, any> | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    provider?: AiProvider;
}