import axios from "axios";
import { UserDetails } from "@/types/admin";
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

// Get all users
export const getUsers = async (): Promise<UserDetails[]> => {
  try {
    const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

// Get a specific user
export const getUser = async (userId: string): Promise<UserDetails> => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error.response?.data || { message: "Failed to fetch user" };
  }
};

// Create a new user
export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role_id: string;
}): Promise<UserDetails> => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw error.response?.data || { message: "Failed to create user" };
  }
};

// Update an existing user
export const updateUser = async (
  userId: string,
  updates: Partial<{
    name: string;
    email: string;
    password?: string;
    role_id: string;
  }>
): Promise<UserDetails> => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, updates, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    throw error.response?.data || { message: "Failed to update user" };
  }
};

// Delete a user
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/users/${userId}`, getAuthHeaders());
    return true;
  } catch (error: any) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error.response?.data || { message: "Failed to delete user" };
  }
};
