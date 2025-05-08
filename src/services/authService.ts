import axios from "axios";

// Define the API base URL
const API_URL = "http://localhost:8000/api";

// Set up axios with credentials
axios.defaults.withCredentials = true;

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
    await axios.get("/sanctum/csrf-cookie");
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
    try {
      // Get CSRF token first
      await getCsrfToken();

      const token = localStorage.getItem("auth_token");
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      return response.data;
    } catch (error: any) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      if (error.response) {
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
      return response.data.user;
    } catch (error) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
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

export default authService;
