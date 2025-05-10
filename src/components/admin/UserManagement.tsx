import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  User,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Save,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import AdminPageContainer from "./AdminPageContainer";
import { usePermissions } from "@/hooks";
import { useCustomToast } from "@/hooks/useToast";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  getUsers,
  getRoles,
  createUser,
  updateUser,
  deleteUser,
  createRole,
  updateRole,
  deleteRole,
  updateUserStatus
} from "@/services/adminService";
import {
  UserDetails,
  UserRole,
  Permission,
  ResourceType,
  ActionType,
} from "@/types/admin";

const UserManagement = () => {
  const {
    canCreate,
    canEdit,
    canDelete,
  } = usePermissions();
  const toast = useCustomToast();
  const { openConfirmDialog, ConfirmationDialog } = useConfirmationDialog();
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDetails | null>(null);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    roleId: "",
    password: "",
  });

  // New role form state
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as Permission[],
  });

  // Permission management
  const resources: ResourceType[] = [
    "dashboard",
    "widget",
    "models",
    "prompts",
    "analytics",
    "settings",
    "users",
  ];

  const actions: ActionType[] = [
    "view",
    "create",
    "edit",
    "delete",
    "export",
    "configure",
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([
        getUsers(),
        getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);

      // Show success toast when refreshing manually (not on initial load)
      if (users.length > 0 || roles.length > 0) {
        toast.success("Data refreshed successfully");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter users based on search query and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    const matchesRole = roleFilter === "all" || user.role.id === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleCreateUser = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!newUser.name || !newUser.email || !newUser.roleId) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate password for new users
      if (!editingUser && !newUser.password) {
        toast.error("Password is required when creating a new user");
        return;
      }

      // Create user data object
      const userData = {
        name: newUser.name,
        email: newUser.email,
        roleId: newUser.roleId,
      };

      // Add password if provided, otherwise a random one will be generated
      if (newUser.password.trim() !== '') {
        (userData as any).password = newUser.password;
      }

      // Call the API to create the user
      const createdUser = await createUser(userData);

      // Add the new user to the state
      setUsers([...users, createdUser]);

      // Show success toast
      toast.success("User created successfully");

      // Close dialog and reset form
      setUserDialogOpen(false);
      setShowPassword(false); // Reset password visibility
      setNewUser({
        name: "",
        email: "",
        roleId: "",
        password: "",
      });
    } catch (error) {
      toast.error("Failed to create user: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      setLoading(true);
      const createdRole = await createRole(newRole);

      // Add the new role to the state
      setRoles([...roles, createdRole]);

      // Show success toast
      toast.success("Role created successfully");

      // Close dialog and reset form
      setRoleDialogOpen(false);
      setNewRole({
        name: "",
        description: "",
        permissions: [],
      });
    } catch (error) {
      toast.error("Failed to create role: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserDetails) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      roleId: user.role.id,
      password: "", // Empty password field when editing (will only be updated if filled)
    });
    setUserDialogOpen(true);
  };

  const handleEditRole = (role: UserRole) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setRoleDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setLoading(true);

      // Validate required fields
      if (!newUser.name || !newUser.email || !newUser.roleId) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Create update data object - only include password if it's not empty
      const updateData = {
        name: newUser.name,
        email: newUser.email,
        roleId: newUser.roleId,
      };

      // Only include password if it's not empty
      if (newUser.password.trim() !== '') {
        (updateData as any).password = newUser.password;
      }

      // Call the API to update the user
      const updatedUser = await updateUser(editingUser.id, updateData);

      // Update the user in the state
      setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));

      // Show success toast
      toast.success("User updated successfully");

      // Close dialog and reset form
      setUserDialogOpen(false);
      setEditingUser(null);
      setShowPassword(false); // Reset password visibility
      setNewUser({
        name: "",
        email: "",
        roleId: "",
        password: "",
      });
    } catch (error) {
      toast.error("Failed to update user: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      setLoading(true);
      const updatedRole = await updateRole(editingRole.id, newRole);

      // Update the role in the state
      setRoles(roles.map(role => role.id === editingRole.id ? updatedRole : role));

      // Show success toast
      toast.success("Role updated successfully");

      // Close dialog and reset form
      setRoleDialogOpen(false);
      setEditingRole(null);
      setNewRole({
        name: "",
        description: "",
        permissions: [],
      });
    } catch (error) {
      toast.error("Failed to update role: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatus = (userId: string, newStatus: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    openConfirmDialog({
      title: `Change User Status`,
      description: `Are you sure you want to change ${user.name}'s status to ${newStatus}?`,
      confirmText: "Change Status",
      cancelText: "Cancel",
      variant: "default",
      onConfirm: async () => {
        try {
          setLoading(true);

          // Call the API to update the user's status
          const updatedUser = await updateUserStatus(userId, newStatus);

          // Update the user in the state
          setUsers(users.map(u => u.id === userId ? updatedUser : u));

          // Show success toast
          toast.success(`User status updated to ${newStatus}`);
        } catch (error) {
          toast.error("Failed to update user status: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    openConfirmDialog({
      title: "Delete User",
      description: `Are you sure you want to delete the user "${user.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          setLoading(true);

          // Call the API to delete the user
          await deleteUser(userId);

          // Remove the user from the state
          setUsers(users.filter(u => u.id !== userId));

          // Show success toast
          toast.success("User deleted successfully");
        } catch (error) {
          toast.error("Failed to delete user: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    openConfirmDialog({
      title: "Delete Role",
      description: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          setLoading(true);
          await deleteRole(roleId);

          // Remove the role from the state
          setRoles(roles.filter(role => role.id !== roleId));

          // Show success toast
          toast.success("Role deleted successfully");
        } catch (error) {
          toast.error("Failed to delete role: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const togglePermission = (resource: ResourceType, action: ActionType) => {
    const currentPermissions = [...newRole.permissions];
    const resourcePermission = currentPermissions.find(
      (p) => p.resource === resource,
    );

    if (resourcePermission) {
      // If the resource permission exists
      if (resourcePermission.actions.includes(action)) {
        // Remove the action if it exists
        resourcePermission.actions = resourcePermission.actions.filter(
          (a) => a !== action,
        );

        // If no actions left, remove the entire resource permission
        if (resourcePermission.actions.length === 0) {
          const index = currentPermissions.findIndex(
            (p) => p.resource === resource,
          );
          currentPermissions.splice(index, 1);
        }
      } else {
        // Add the action if it doesn't exist
        resourcePermission.actions.push(action);
      }
    } else {
      // If the resource permission doesn't exist, create it with the action
      currentPermissions.push({
        resource,
        actions: [action],
      });
    }

    setNewRole({
      ...newRole,
      permissions: currentPermissions,
    });
  };

  // Toggle all permissions for a resource
  const toggleAllResourcePermissions = (resource: ResourceType, checked: boolean) => {
    const currentPermissions = [...newRole.permissions];

    if (checked) {
      // Add all actions for this resource
      const existingPermission = currentPermissions.find(p => p.resource === resource);

      if (existingPermission) {
        // Add any missing actions
        actions.forEach(action => {
          if (!existingPermission.actions.includes(action)) {
            existingPermission.actions.push(action);
          }
        });
      } else {
        // Create new permission with all actions
        currentPermissions.push({
          resource,
          actions: [...actions],
        });
      }
    } else {
      // Remove all actions for this resource
      const index = currentPermissions.findIndex(p => p.resource === resource);
      if (index !== -1) {
        currentPermissions.splice(index, 1);
      }
    }

    setNewRole({
      ...newRole,
      permissions: currentPermissions,
    });
  };

  // Toggle all permissions for an action across all resources
  const toggleAllActionPermissions = (action: ActionType, checked: boolean) => {
    const currentPermissions = [...newRole.permissions];

    resources.forEach(resource => {
      const resourcePermission = currentPermissions.find(p => p.resource === resource);

      if (checked) {
        // Add this action to all resources
        if (resourcePermission) {
          if (!resourcePermission.actions.includes(action)) {
            resourcePermission.actions.push(action);
          }
        } else {
          currentPermissions.push({
            resource,
            actions: [action],
          });
        }
      } else {
        // Remove this action from all resources
        if (resourcePermission) {
          resourcePermission.actions = resourcePermission.actions.filter(a => a !== action);

          // If no actions left, remove the entire resource permission
          if (resourcePermission.actions.length === 0) {
            const index = currentPermissions.findIndex(p => p.resource === resource);
            currentPermissions.splice(index, 1);
          }
        }
      }
    });

    setNewRole({
      ...newRole,
      permissions: currentPermissions,
    });
  };

  const hasPermission = (resource: ResourceType, action: ActionType) => {
    const permission = newRole.permissions.find((p) => p.resource === resource);
    return permission ? permission.actions.includes(action) : false;
  };

  // Check if all actions are selected for a resource
  const hasAllResourcePermissions = (resource: ResourceType) => {
    const permission = newRole.permissions.find((p) => p.resource === resource);
    if (!permission) return false;

    // Check if all actions are included
    return actions.every(action => permission.actions.includes(action));
  };

  // Check if an action is selected for all resources
  const hasAllActionPermissions = (action: ActionType) => {
    // Check if all resources have this action
    return resources.every(resource => {
      const permission = newRole.permissions.find(p => p.resource === resource);
      return permission && permission.actions.includes(action);
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" /> Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="bg-rose-500/10 text-rose-500 border-rose-500/20"
          >
            <XCircle className="h-3 w-3 mr-1" /> Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-500 border-amber-500/20"
          >
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminPageContainer
      title="User Management"
      description="Manage users, roles, and permissions for your AI chat system."
    >
      <ConfirmationDialog />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Roles & Permissions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage user accounts and their roles
                </CardDescription>
              </div>
              {canCreate("users") && (
                <Dialog
                  open={userDialogOpen}
                  onOpenChange={(open) => {
                    // Reset password visibility when dialog is opened or closed
                    if (!open) {
                      setShowPassword(false);
                    }
                    setUserDialogOpen(open);
                  }}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingUser ? "Edit User" : "Add New User"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingUser
                          ? "Update user details and permissions"
                          : "Create a new user account"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="text-sm text-muted-foreground">
                        Fields marked with <span className="text-destructive">*</span> are required.
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-1">
                            Full Name
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            value={newUser.name}
                            onChange={(e) =>
                              setNewUser({ ...newUser, name: e.target.value })
                            }
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-1">
                            Email Address
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) =>
                              setNewUser({ ...newUser, email: e.target.value })
                            }
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="role" className="flex items-center gap-1">
                            Role
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={newUser.roleId}
                            onValueChange={(value) =>
                              setNewUser({ ...newUser, roleId: value })
                            }
                          >
                            <SelectTrigger id="role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Status is managed by the backend and not editable in the UI */}

                        {/* Password field */}
                        <div className="space-y-2">
                          <Label htmlFor="password" className="flex items-center gap-1">
                            {editingUser ? "New Password (leave empty to keep current)" : "Password"}
                            {!editingUser && <span className="text-destructive">*</span>}
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder={editingUser ? "••••••••" : "Enter password"}
                              value={newUser.password}
                              onChange={(e) =>
                                setNewUser({ ...newUser, password: e.target.value })
                              }
                              className="pr-10" // Add padding for the toggle button
                              required={!editingUser} // Required for new users
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowPassword(!showPassword)}
                              tabIndex={-1} // Don't include in tab order
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showPassword ? "Hide password" : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      {!editingUser && (
                        <div className="space-y-2">
                          <Label htmlFor="sendInvite">
                            Send invitation email
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Switch id="sendInvite" defaultChecked />
                            <Label htmlFor="sendInvite">
                              Send an email with login instructions
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUserDialogOpen(false);
                          setEditingUser(null);
                          setShowPassword(false); // Reset password visibility
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={
                          editingUser ? handleUpdateUser : handleCreateUser
                        }
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {editingUser ? "Update User" : "Create User"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setRoleFilter("all");
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchData}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border border-border">
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-primary/10 text-primary border-primary/20 font-normal"
                            >
                              {user.role.name}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(user.lastActive)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {canEdit("users") && (
                                  <DropdownMenuItem
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit User
                                  </DropdownMenuItem>
                                )}

                                {canEdit("users") && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>

                                    <DropdownMenuItem
                                      onClick={() => handleUpdateUserStatus(user.id, "active")}
                                      disabled={user.status === "active"}
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                                      Set as Active
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onClick={() => handleUpdateUserStatus(user.id, "inactive")}
                                      disabled={user.status === "inactive"}
                                    >
                                      <XCircle className="h-4 w-4 mr-2 text-rose-500" />
                                      Set as Inactive
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onClick={() => handleUpdateUserStatus(user.id, "pending")}
                                      disabled={user.status === "pending"}
                                    >
                                      <Clock className="h-4 w-4 mr-2 text-amber-500" />
                                      Set as Pending
                                    </DropdownMenuItem>
                                  </>
                                )}

                                <DropdownMenuSeparator />
                                {canDelete("users") && (
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              {/* Pagination could go here */}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>
                  Manage roles and their associated permissions
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchData}
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
                {canCreate("users") && (
                  <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingRole ? "Edit Role" : "Add New Role"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingRole
                            ? "Update role details and permissions"
                            : "Create a new role with specific permissions"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="roleName">Role Name</Label>
                            <Input
                              id="roleName"
                              value={newRole.name}
                              onChange={(e) =>
                                setNewRole({ ...newRole, name: e.target.value })
                              }
                              placeholder="Custom Role"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="roleDescription">Description</Label>
                            <Input
                              id="roleDescription"
                              value={newRole.description}
                              onChange={(e) =>
                                setNewRole({
                                  ...newRole,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Role description"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Permissions</Label>
                          <div className="border rounded-md p-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[200px]">
                                    Resource
                                  </TableHead>
                                  {actions.map((action) => (
                                    <TableHead
                                      key={action}
                                      className="text-center"
                                    >
                                      {action.charAt(0).toUpperCase() +
                                        action.slice(1)}
                                    </TableHead>
                                  ))}
                                  <TableHead className="text-center w-[100px]">
                                    All
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {/* Header row with "Select All" for each action */}
                                <TableRow className="bg-muted/50">
                                  <TableCell className="font-medium">
                                    Select All
                                  </TableCell>
                                  {actions.map((action) => (
                                    <TableCell
                                      key={`all-${action}`}
                                      className="text-center"
                                    >
                                      <Checkbox
                                        checked={hasAllActionPermissions(action)}
                                        onCheckedChange={(checked) =>
                                          toggleAllActionPermissions(action, !!checked)
                                        }
                                      />
                                    </TableCell>
                                  ))}
                                  <TableCell className="text-center">
                                    {/* This would select everything - not implemented */}
                                  </TableCell>
                                </TableRow>

                                {/* Resource rows */}
                                {resources.map((resource) => (
                                  <TableRow key={resource}>
                                    <TableCell className="font-medium">
                                      {resource.charAt(0).toUpperCase() +
                                        resource.slice(1)}
                                    </TableCell>
                                    {actions.map((action) => (
                                      <TableCell
                                        key={`${resource}-${action}`}
                                        className="text-center"
                                      >
                                        <Checkbox
                                          checked={hasPermission(
                                            resource,
                                            action,
                                          )}
                                          onCheckedChange={() =>
                                            togglePermission(resource, action)
                                          }
                                        />
                                      </TableCell>
                                    ))}
                                    <TableCell className="text-center">
                                      <Checkbox
                                        checked={hasAllResourcePermissions(resource)}
                                        onCheckedChange={(checked) =>
                                          toggleAllResourcePermissions(resource, !!checked)
                                        }
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setRoleDialogOpen(false);
                            setEditingRole(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={
                            editingRole ? handleUpdateRole : handleCreateRole
                          }
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {editingRole ? "Update Role" : "Create Role"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Loading roles...
                        </TableCell>
                      </TableRow>
                    ) : roles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No roles found
                        </TableCell>
                      </TableRow>
                    ) : (
                      roles.map((role) => {
                        const usersWithRole = users.filter(
                          (u) => u.role.id === role.id,
                        ).length;
                        const totalPermissions = role.permissions.reduce(
                          (total, p) => total + p.actions.length,
                          0,
                        );

                        return (
                          <TableRow key={role.id}>
                            <TableCell>
                              <div className="font-medium">{role.name}</div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {role.description}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {usersWithRole} user{usersWithRole !== 1 && "s"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-primary/10 text-primary border-primary/20"
                              >
                                {totalPermissions} permission
                                {totalPermissions !== 1 && "s"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {canEdit("users") && (
                                    <DropdownMenuItem
                                      onClick={() => handleEditRole(role)}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Role
                                    </DropdownMenuItem>
                                  )}
                                  {canDelete("users") && (
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => handleDeleteRole(role.id)}
                                      disabled={usersWithRole > 0}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Role
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageContainer>
  );
};

export default UserManagement;
