import axios from "axios";

// Define the API base URL
const API_URL = "http://localhost:8000/api";

// Set up axios with credentials
axios.defaults.withCredentials = true;

// Add CSRF token to all requests
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

// Add response interceptor to handle CSRF token mismatches
axios.interceptors.response.use(
  response => response,
  async error => {
    // Handle CSRF token mismatch (status 419)
    if (error.response && error.response.status === 419) {
      console.log("CSRF token mismatch detected, refreshing token...");

      try {
        // Get a fresh CSRF token
        await axios.get(`${API_URL.replace('/api', '')}/sanctum/csrf-cookie`);

        // Update the token in headers
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
          axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
        }

        // Retry the original request
        return axios(error.config);
      } catch (refreshError) {
        console.error("Failed to refresh CSRF token:", refreshError);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthResponse {
  status: string;
  message: string;
  user?: any;
  token?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// Get CSRF token from Laravel Sanctum
const getCsrfToken = async () => {
  try {
    console.log("getCsrfToken: Getting CSRF token");
    // The URL should be the Laravel backend URL without 'api/' for the sanctum endpoint
    const csrfUrl = `${API_URL.replace('/api', '')}/sanctum/csrf-cookie`;
    console.log("getCsrfToken: CSRF URL:", csrfUrl);

    const response = await axios.get(csrfUrl);
    console.log("getCsrfToken: CSRF response status:", response.status);
    return response;
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    throw error;
  }
};

// Authentication service
const authService = {
  // Register a new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // Get CSRF token first
      await getCsrfToken();

      const response = await axios.post(`${API_URL}/register`, data);
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw { message: "Network error occurred" };
    }
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      // Get CSRF token first
      await getCsrfToken();

      const response = await axios.post(`${API_URL}/login`, data);
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw { message: "Network error occurred" };
    }
  },

  // Logout user
  logout: async (): Promise<AuthResponse> => {
    console.log("authService: logout called");
    try {
      // Get CSRF token first
      console.log("authService: getting CSRF token");
      await getCsrfToken();
      console.log("authService: CSRF token obtained");

      const token = localStorage.getItem("auth_token");
      console.log("authService: token from localStorage:", token ? "exists" : "null");

      console.log("authService: calling logout API");
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("authService: logout API response:", response.data);

      console.log("authService: removing token and user from localStorage");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      return response.data;
    } catch (error: any) {
      console.error("authService: logout error", error);

      console.log("authService: removing token and user from localStorage (error case)");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      if (error.response) {
        console.error("authService: API error response:", error.response.data);
        throw error.response.data;
      }
      throw { message: "Network error occurred" };
    }
  },

  // Get current authenticated user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return null;

      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Store the updated user data
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data.user;
    } catch (error) {
      // Don't remove token on every error - only on 401 unauthorized
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("auth_token");
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem("auth_token");
  },
};

// Helper function to get auth headers for API requests
export const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export default authService;
