import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { getAuthHeaders } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface ApiEndpoint {
  id: string;
  name: string;
  method: Method;
  path: string;
  description?: string;
  parameters?: ApiParameter[];
  headers?: Record<string, string>;
  body?: any;
  sampleResponse?: any;
}

export interface ApiParameter {
  name: string;
  type: 'path' | 'query' | 'header' | 'body';
  required: boolean;
  description?: string;
  defaultValue?: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  endpoints: ApiEndpoint[];
}

export interface ApiRequest {
  endpoint: ApiEndpoint;
  parameters: Record<string, string>;
  headers: Record<string, string>;
  body: any;
  environmentVariables?: Record<string, string>;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

export interface RequestHistoryItem {
  id: string;
  timestamp: Date;
  request: ApiRequest;
  response?: ApiResponse;
}

// Get all available API categories and endpoints
export const getApiCategories = async (): Promise<ApiCategory[]> => {
  try {
    // In a real implementation, this would fetch from your API
    // For now, we'll return some sample data
    const response = await axios.get(`${API_URL}/api-tester/categories`, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    console.error('Error fetching API categories:', error);
    
    // Return sample data if the endpoint doesn't exist
    return getSampleApiCategories();
  }
};

// Execute an API request
export const executeRequest = async (request: ApiRequest): Promise<ApiResponse> => {
  const startTime = performance.now();
  
  try {
    // Prepare the URL with path parameters
    let url = request.endpoint.path;
    
    // Replace path parameters
    if (request.parameters) {
      Object.entries(request.parameters).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, encodeURIComponent(value));
      });
    }
    
    // Add query parameters
    const queryParams: Record<string, string> = {};
    request.endpoint.parameters?.forEach(param => {
      if (param.type === 'query' && request.parameters[param.name]) {
        queryParams[param.name] = request.parameters[param.name];
      }
    });
    
    // Prepare headers
    const headers = {
      ...request.headers,
    };
    
    // Apply environment variables
    if (request.environmentVariables) {
      // Replace variables in URL
      Object.entries(request.environmentVariables).forEach(([key, value]) => {
        url = url.replace(new RegExp(`{{${key}}}`, 'g'), value);
        
        // Replace variables in headers
        Object.keys(headers).forEach(headerKey => {
          headers[headerKey] = headers[headerKey].replace(
            new RegExp(`{{${key}}}`, 'g'),
            value
          );
        });
        
        // Replace variables in body if it's a string
        if (typeof request.body === 'string') {
          request.body = request.body.replace(
            new RegExp(`{{${key}}}`, 'g'),
            value
          );
        }
      });
    }
    
    // Prepare request config
    const config: AxiosRequestConfig = {
      method: request.endpoint.method,
      url: url.startsWith('http') ? url : `${API_URL}/${url}`,
      headers,
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
      data: request.body,
    };
    
    // Execute the request
    const response: AxiosResponse = await axios(config);
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // Calculate response size
    const responseSize = JSON.stringify(response.data).length;
    
    // Format headers for display
    const responseHeaders: Record<string, string> = {};
    Object.entries(response.headers).forEach(([key, value]) => {
      responseHeaders[key] = typeof value === 'string' ? value : JSON.stringify(value);
    });
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data: response.data,
      time: Math.round(responseTime),
      size: responseSize,
    };
  } catch (error: any) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const responseHeaders: Record<string, string> = {};
      Object.entries(error.response.headers).forEach(([key, value]) => {
        responseHeaders[key] = typeof value === 'string' ? value : JSON.stringify(value);
      });
      
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: responseHeaders,
        data: error.response.data,
        time: Math.round(responseTime),
        size: JSON.stringify(error.response.data).length,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        status: 0,
        statusText: 'No response received',
        headers: {},
        data: { error: 'The request was made but no response was received' },
        time: Math.round(responseTime),
        size: 0,
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        status: 0,
        statusText: 'Request Error',
        headers: {},
        data: { error: error.message },
        time: Math.round(responseTime),
        size: 0,
      };
    }
  }
};

// Get sample API categories and endpoints
export const getSampleApiCategories = (): ApiCategory[] => {
  return [
    {
      id: 'auth',
      name: 'Authentication',
      endpoints: [
        {
          id: 'login',
          name: 'Login',
          method: 'POST',
          path: 'auth/login',
          description: 'Authenticate a user and get a token',
          parameters: [],
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            email: 'admin@example.com',
            password: 'password',
          },
          sampleResponse: {
            success: true,
            data: {
              token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
              user: {
                id: 1,
                name: 'Admin User',
                email: 'admin@example.com',
              },
            },
          },
        },
        {
          id: 'register',
          name: 'Register',
          method: 'POST',
          path: 'auth/register',
          description: 'Register a new user',
          parameters: [],
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            name: 'New User',
            email: 'user@example.com',
            password: 'password',
            password_confirmation: 'password',
          },
          sampleResponse: {
            success: true,
            data: {
              user: {
                id: 2,
                name: 'New User',
                email: 'user@example.com',
              },
            },
          },
        },
      ],
    },
    {
      id: 'ai-providers',
      name: 'AI Providers',
      endpoints: [
        {
          id: 'get-providers',
          name: 'Get All Providers',
          method: 'GET',
          path: 'ai-providers',
          description: 'Get a list of all AI providers',
          parameters: [],
          headers: {
            'Authorization': 'Bearer {{token}}',
          },
          sampleResponse: {
            success: true,
            data: [
              {
                id: 1,
                name: 'OpenAI',
                slug: 'openai',
                description: 'OpenAI API provider',
                logo_url: null,
                is_active: true,
                created_at: '2023-08-15T12:00:00.000000Z',
                updated_at: '2023-08-15T12:00:00.000000Z',
              },
              {
                id: 2,
                name: 'Anthropic',
                slug: 'anthropic',
                description: 'Anthropic API provider',
                logo_url: null,
                is_active: true,
                created_at: '2023-08-15T12:00:00.000000Z',
                updated_at: '2023-08-15T12:00:00.000000Z',
              },
            ],
          },
        },
        {
          id: 'get-provider',
          name: 'Get Provider',
          method: 'GET',
          path: 'ai-providers/{id}',
          description: 'Get a specific AI provider by ID',
          parameters: [
            {
              name: 'id',
              type: 'path',
              required: true,
              description: 'The ID of the provider',
            },
          ],
          headers: {
            'Authorization': 'Bearer {{token}}',
          },
          sampleResponse: {
            success: true,
            data: {
              id: 1,
              name: 'OpenAI',
              slug: 'openai',
              description: 'OpenAI API provider',
              logo_url: null,
              is_active: true,
              created_at: '2023-08-15T12:00:00.000000Z',
              updated_at: '2023-08-15T12:00:00.000000Z',
            },
          },
        },
      ],
    },
    {
      id: 'ai-models',
      name: 'AI Models',
      endpoints: [
        {
          id: 'get-models',
          name: 'Get All Models',
          method: 'GET',
          path: 'ai-models',
          description: 'Get a list of all AI models',
          parameters: [
            {
              name: 'active_only',
              type: 'query',
              required: false,
              description: 'Filter to only active models',
              defaultValue: '1',
            },
          ],
          headers: {
            'Authorization': 'Bearer {{token}}',
          },
          sampleResponse: {
            success: true,
            data: [
              {
                id: 1,
                provider_id: 1,
                name: 'GPT-4',
                slug: 'gpt-4',
                type: 'chat',
                capabilities: ['text-generation', 'chat'],
                max_tokens: 8192,
                api_endpoint: null,
                is_active: true,
                is_default: true,
                created_at: '2023-08-15T12:00:00.000000Z',
                updated_at: '2023-08-15T12:00:00.000000Z',
                provider: {
                  id: 1,
                  name: 'OpenAI',
                  slug: 'openai',
                },
              },
              {
                id: 2,
                provider_id: 2,
                name: 'Claude 3 Opus',
                slug: 'claude-3-opus',
                type: 'chat',
                capabilities: ['text-generation', 'chat'],
                max_tokens: 4096,
                api_endpoint: null,
                is_active: true,
                is_default: false,
                created_at: '2023-08-15T12:00:00.000000Z',
                updated_at: '2023-08-15T12:00:00.000000Z',
                provider: {
                  id: 2,
                  name: 'Anthropic',
                  slug: 'anthropic',
                },
              },
            ],
          },
        },
      ],
    },
  ];
};
