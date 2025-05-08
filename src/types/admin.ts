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

// User Role and Permission System
export type ResourceType =
  | "dashboard"
  | "widget"
  | "models"
  | "prompts"
  | "analytics"
  | "settings"
  | "users";
export type ActionType =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "export"
  | "configure";

export interface Permission {
  resource: ResourceType;
  actions: ActionType[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem?: boolean; // System roles cannot be deleted
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  lastActive: Date;
  status: "active" | "inactive" | "pending";
  createdAt: Date;
  updatedAt: Date;
}
