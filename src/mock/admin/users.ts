import { UserDetails, UserRole, Permission } from "@/types/admin";

// Define system roles with their permissions
export const systemRoles: UserRole[] = [
  {
    id: "role-admin",
    name: "Administrator",
    description: "Full access to all system features and settings",
    permissions: [
      { resource: "dashboard", actions: ["view"] },
      {
        resource: "widget",
        actions: ["view", "create", "edit", "delete", "configure"],
      },
      {
        resource: "models",
        actions: ["view", "create", "edit", "delete", "configure"],
      },
      {
        resource: "prompts",
        actions: ["view", "create", "edit", "delete", "export"],
      },
      { resource: "analytics", actions: ["view", "export"] },
      { resource: "settings", actions: ["view", "edit", "configure"] },
      { resource: "users", actions: ["view", "create", "edit", "delete"] },
    ],
  },
  {
    id: "role-manager",
    name: "Manager",
    description:
      "Can manage content and view analytics, but cannot modify system settings",
    permissions: [
      { resource: "dashboard", actions: ["view"] },
      { resource: "widget", actions: ["view", "edit", "configure"] },
      { resource: "models", actions: ["view", "edit"] },
      { resource: "prompts", actions: ["view", "create", "edit", "export"] },
      { resource: "analytics", actions: ["view", "export"] },
      { resource: "settings", actions: ["view"] },
      { resource: "users", actions: ["view"] },
    ],
  },
  {
    id: "role-editor",
    name: "Editor",
    description:
      "Can edit content but cannot access system settings or user management",
    permissions: [
      { resource: "dashboard", actions: ["view"] },
      { resource: "widget", actions: ["view", "edit"] },
      { resource: "models", actions: ["view"] },
      { resource: "prompts", actions: ["view", "create", "edit"] },
      { resource: "analytics", actions: ["view"] },
    ],
  },
  {
    id: "role-viewer",
    name: "Viewer",
    description: "Read-only access to content and analytics",
    permissions: [
      { resource: "dashboard", actions: ["view"] },
      { resource: "widget", actions: ["view"] },
      { resource: "models", actions: ["view"] },
      { resource: "prompts", actions: ["view"] },
      { resource: "analytics", actions: ["view"] },
    ],
  },
];

// Define mock users with their roles
export const mockUsers: UserDetails[] = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@example.com",
    role: systemRoles[0], // Administrator
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    lastActive: new Date(),
    status: "active",
    createdAt: new Date(Date.now() - 30 * 86400000), // 30 days ago
    updatedAt: new Date(),
  },
  {
    id: "user-2",
    name: "John Manager",
    email: "john@example.com",
    role: systemRoles[1], // Manager
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    lastActive: new Date(Date.now() - 86400000), // 1 day ago
    status: "active",
    createdAt: new Date(Date.now() - 20 * 86400000), // 20 days ago
    updatedAt: new Date(Date.now() - 5 * 86400000), // 5 days ago
  },
  {
    id: "user-3",
    name: "Emily Editor",
    email: "emily@example.com",
    role: systemRoles[2], // Editor
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    lastActive: new Date(Date.now() - 129600000), // 1.5 days ago
    status: "active",
    createdAt: new Date(Date.now() - 15 * 86400000), // 15 days ago
    updatedAt: new Date(Date.now() - 3 * 86400000), // 3 days ago
  },
  {
    id: "user-4",
    name: "Sarah Viewer",
    email: "sarah@example.com",
    role: systemRoles[3], // Viewer
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    lastActive: new Date(Date.now() - 172800000), // 2 days ago
    status: "active",
    createdAt: new Date(Date.now() - 10 * 86400000), // 10 days ago
    updatedAt: new Date(Date.now() - 10 * 86400000), // 10 days ago
  },
  {
    id: "user-5",
    name: "New Pending User",
    email: "pending@example.com",
    role: systemRoles[3], // Viewer
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=pending",
    lastActive: new Date(),
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 86400000), // 1 day ago
  },
  {
    id: "user-6",
    name: "Inactive User",
    email: "inactive@example.com",
    role: systemRoles[3], // Viewer
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=inactive",
    lastActive: new Date(Date.now() - 30 * 86400000), // 30 days ago
    status: "inactive",
    createdAt: new Date(Date.now() - 60 * 86400000), // 60 days ago
    updatedAt: new Date(Date.now() - 30 * 86400000), // 30 days ago
  },
];

export const currentUser = mockUsers[0];

// Helper function to check if a user has permission for a specific action on a resource
export const hasPermission = (
  user: UserDetails,
  resource: string,
  action: string,
): boolean => {
  if (!user || !user.role || !user.role.permissions) return false;

  const permission = user.role.permissions.find((p) => p.resource === resource);
  if (!permission) return false;

  return permission.actions.includes(action as any);
};
