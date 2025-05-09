import axios from "axios";
import { UserRole, Permission } from "@/types/admin";
import authService from "./authService";

// Define the API base URL
const API_URL = "http://localhost:8000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all roles
export const getRoles = async (): Promise<UserRole[]> => {
  try {
    const response = await axios.get(`${API_URL}/roles`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    throw error.response?.data || { message: "Failed to fetch roles" };
  }
};

// Get a specific role
export const getRole = async (roleId: string): Promise<UserRole> => {
  try {
    const response = await axios.get(`${API_URL}/roles/${roleId}`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching role ${roleId}:`, error);
    throw error.response?.data || { message: "Failed to fetch role" };
  }
};

// Create a new role
export const createRole = async (roleData: Omit<UserRole, "id">): Promise<UserRole> => {
  try {
    const response = await axios.post(`${API_URL}/roles`, roleData, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating role:", error);
    throw error.response?.data || { message: "Failed to create role" };
  }
};

// Update an existing role
export const updateRole = async (roleId: string, updates: Partial<UserRole>): Promise<UserRole> => {
  try {
    const response = await axios.put(`${API_URL}/roles/${roleId}`, updates, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating role ${roleId}:`, error);
    throw error.response?.data || { message: "Failed to update role" };
  }
};

// Delete a role
export const deleteRole = async (roleId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/roles/${roleId}`, getAuthHeaders());
    return true;
  } catch (error: any) {
    console.error(`Error deleting role ${roleId}:`, error);
    throw error.response?.data || { message: "Failed to delete role" };
  }
};

// Get all permissions
export const getPermissions = async (): Promise<Permission[]> => {
  try {
    const response = await axios.get(`${API_URL}/permissions`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching permissions:", error);
    throw error.response?.data || { message: "Failed to fetch permissions" };
  }
};

// Get permissions grouped by resource
export const getGroupedPermissions = async (): Promise<{ resource: string; actions: string[] }[]> => {
  try {
    const response = await axios.get(`${API_URL}/permissions/grouped`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching grouped permissions:", error);
    throw error.response?.data || { message: "Failed to fetch grouped permissions" };
  }
};
