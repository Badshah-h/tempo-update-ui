import {
  PromptTemplate,
  AnalyticsData,
  TopQuery,
  Issue,
  RecentQuery,
  UserDetails,
  UserRole,
  Permission,
} from "@/types/admin";
import {
  mockPromptTemplates,
  templateCategories,
} from "@/mock/admin/templates";
import {
  mockAnalyticsData,
  mockTopQueries,
  mockRecentIssues,
  mockUserEngagement,
  mockTrafficSources,
} from "@/mock/admin/analytics";
// Removed mock imports
import axios from "axios";

// API base URL - hardcoded to avoid process.env issues
const API_URL = "http://localhost:8000/api";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get auth headers
const getAuthHeaders = () => {
  // Get the token from localStorage - use auth_token which is what authService uses
  const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Prompt Templates
export const getPromptTemplates = async (): Promise<PromptTemplate[]> => {
  await delay(300);
  return mockPromptTemplates;
};

export const getPromptTemplate = async (
  templateId: string,
): Promise<PromptTemplate | undefined> => {
  await delay(200);
  return mockPromptTemplates.find((template) => template.id === templateId);
};

export const updatePromptTemplate = async (
  templateId: string,
  updates: Partial<PromptTemplate>,
): Promise<PromptTemplate> => {
  await delay(300);
  const template = mockPromptTemplates.find((t) => t.id === templateId);
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
export const getAnalyticsData = async (
  period: string = "7d",
): Promise<AnalyticsData> => {
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
export const getUsers = async (): Promise<UserDetails[]> => {
  try {
    const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
    return response.data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (userData: {
  name: string;
  email: string;
  roleId: string;
  password?: string;
}): Promise<UserDetails> => {
  try {
    // Generate a random password if not provided
    const dataToSend = {
      name: userData.name,
      email: userData.email,
      password: userData.password || Math.random().toString(36).slice(-8),
      role_id: userData.roleId, // Convert to snake_case for the API
    };

    const response = await axios.post(
      `${API_URL}/users`,
      dataToSend,
      getAuthHeaders()
    );

    return response.data.user;
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle validation errors
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      const validationErrors = error.response.data.errors;

      // Check for email uniqueness error
      if (validationErrors?.email?.includes('The email has already been taken.')) {
        throw new Error(`The email address "${userData.email}" is already in use. Please use a different email.`);
      }

      // Handle other validation errors
      if (validationErrors) {
        // Flatten validation errors into a single message
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');

        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }

    // Re-throw the original error if it's not a validation error
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/users/${userId}`, getAuthHeaders());
    return true;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);

    // Handle not found error
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('User not found. It may have been deleted by another administrator.');
    }

    // Handle forbidden error
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new Error('You do not have permission to delete this user.');
    }

    // Handle other errors
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    // Re-throw the original error if it's not a handled error
    throw error;
  }
};

export const getCurrentUser = async (): Promise<UserDetails> => {
  try {
    const response = await axios.get(`${API_URL}/user`, getAuthHeaders());

    // If we don't get a user from the API, try to get it from localStorage
    if (!response.data.user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    }

    return response.data.user;
  } catch (error) {
    console.error("Error fetching current user:", error);

    // Try to get user from localStorage as fallback
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    // If we get here, we couldn't get the user from API or localStorage
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  updates: {
    name?: string;
    email?: string;
    roleId?: string;
    password?: string;
    status?: string;
  },
): Promise<UserDetails> => {
  try {
    // Only send fields that are actually supported by the API
    const dataToSend: Record<string, any> = {};

    if (updates.name) dataToSend.name = updates.name;
    if (updates.email) dataToSend.email = updates.email;
    if (updates.password) dataToSend.password = updates.password;
    if (updates.roleId) dataToSend.role_id = updates.roleId;
    if (updates.status) dataToSend.status = updates.status;

    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      dataToSend,
      getAuthHeaders()
    );
    return response.data.user;
  } catch (error) {
    console.error("Error updating user:", error);

    // Handle validation errors
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      const validationErrors = error.response.data.errors;

      // Check for email uniqueness error
      if (validationErrors?.email?.includes('The email has already been taken.') && updates.email) {
        throw new Error(`The email address "${updates.email}" is already in use. Please use a different email.`);
      }

      // Handle other validation errors
      if (validationErrors) {
        // Flatten validation errors into a single message
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
            return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          })
          .join('; ');

        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }

    // Handle not found error
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('User not found. It may have been deleted by another administrator.');
    }

    // Re-throw the original error if it's not a validation error
    throw error;
  }
};

// Roles and Permissions
export const getRoles = async (): Promise<UserRole[]> => {
  try {
    const response = await axios.get(`${API_URL}/roles`, getAuthHeaders());
    return response.data.roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const getRole = async (
  roleId: string,
): Promise<UserRole | undefined> => {
  try {
    const response = await axios.get(`${API_URL}/roles/${roleId}`, getAuthHeaders());
    return response.data.role;
  } catch (error) {
    console.error(`Error fetching role ${roleId}:`, error);
    return undefined;
  }
};

export const createRole = async (
  roleData: Omit<UserRole, "id">,
): Promise<UserRole> => {
  try {
    const response = await axios.post(
      `${API_URL}/roles`,
      roleData,
      getAuthHeaders()
    );
    return response.data.role;
  } catch (error) {
    console.error("Error creating role:", error);

    // Handle validation errors
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      const validationErrors = error.response.data.errors;

      // Check for name uniqueness error
      if (validationErrors?.name?.includes('The name has already been taken.')) {
        throw new Error(`The role name "${roleData.name}" is already in use. Please use a different name.`);
      }

      // Handle other validation errors
      if (validationErrors) {
        // Flatten validation errors into a single message
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
            return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          })
          .join('; ');

        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }

    // Handle forbidden error
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new Error('You do not have permission to create roles.');
    }

    // Handle other errors
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    // Re-throw the original error if it's not a handled error
    throw error;
  }
};

export const updateRole = async (
  roleId: string,
  updates: Partial<UserRole>,
): Promise<UserRole> => {
  try {
    const response = await axios.put(
      `${API_URL}/roles/${roleId}`,
      updates,
      getAuthHeaders()
    );
    return response.data.role;
  } catch (error) {
    console.error(`Error updating role ${roleId}:`, error);
    throw error;
  }
};

export const deleteRole = async (roleId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/roles/${roleId}`, getAuthHeaders());
    return true;
  } catch (error) {
    console.error(`Error deleting role ${roleId}:`, error);
    throw error;
  }
};

// Check if user is admin
export const updateUserStatus = async (
  userId: string,
  status: string
): Promise<UserDetails> => {
  try {
    const response = await axios.patch(
      `${API_URL}/users/${userId}/status`,
      { status },
      getAuthHeaders()
    );
    return response.data.user;
  } catch (error) {
    console.error(`Error updating user status for ${userId}:`, error);

    // Handle not found error
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('User not found. It may have been deleted by another administrator.');
    }

    // Handle forbidden error
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new Error('You do not have permission to update this user\'s status.');
    }

    // Handle validation errors
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      const validationErrors = error.response.data.errors;

      if (validationErrors) {
        // Flatten validation errors into a single message
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
            return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          })
          .join('; ');

        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }

    // Handle other errors
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    // Re-throw the original error if it's not a handled error
    throw error;
  }
};

export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/admin-check`, getAuthHeaders());
    return response.data.isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Permission checking
export const checkPermission = (
  user: UserDetails,
  resource: string,
  action: string,
): boolean => {
  // Special case for admin@example.com - always return true
  if (user?.email === 'admin@example.com') {
    return true;
  }

  if (!user || !user.role || !user.role.permissions) {
    return false;
  }

  const permission = user.role.permissions.find(p => p.resource === resource);
  if (!permission) {
    return false;
  }

  return permission.actions.includes(action as any);
};
