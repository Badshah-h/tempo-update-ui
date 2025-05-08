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

export interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    variables: string[];
    content: string;
}

export interface AnalyticsData {
    conversations: {
        total: number;
        trend: number;
        chartData: number[];
    };
    messages: {
        total: number;
        trend: number;
        chartData: number[];
    };
    responseTime: {
        average: number;
        trend: number;
        chartData: number[];
    };
    completionRate: {
        percentage: number;
        trend: number;
        chartData: number[];
    };
}

export interface RecentQuery {
    query: string;
    time: string;
    tokens: number;
    success: boolean;
}

export interface TopQuery {
    query: string;
    count: number;
    trend: "up" | "down" | "same";
}

export interface Issue {
    query: string;
    time: string;
    status: "unresolved" | "investigating" | "resolved";
}
