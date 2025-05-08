import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import AdminPageContainer from "./AdminPageContainer";
import { usePermissions } from "@/hooks";
import { getUsers, getRoles } from "@/services/adminService";
import {
  UserDetails,
  UserRole,
  Permission,
  ResourceType,
  ActionType,
} from "@/types/admin";

const UserManagement = () => {
  const {
    user: currentUser,
    canView,
    canCreate,
    canEdit,
    canDelete,
  } = usePermissions();
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

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    roleId: "",
    status: "active",
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, rolesData] = await Promise.all([
          getUsers(),
          getRoles(),
        ]);
        setUsers(usersData);
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

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

  const handleCreateUser = () => {
    // In a real app, this would call an API to create the user
    console.log("Creating user:", newUser);
    setUserDialogOpen(false);

    // Reset form
    setNewUser({
      name: "",
      email: "",
      roleId: "",
      status: "active",
    });
  };

  const handleCreateRole = () => {
    // In a real app, this would call an API to create the role
    console.log("Creating role:", newRole);
    setRoleDialogOpen(false);

    // Reset form
    setNewRole({
      name: "",
      description: "",
      permissions: [],
    });
  };

  const handleEditUser = (user: UserDetails) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      roleId: user.role.id,
      status: user.status,
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

  const handleUpdateUser = () => {
    // In a real app, this would call an API to update the user
    console.log("Updating user:", editingUser?.id, newUser);
    setUserDialogOpen(false);
    setEditingUser(null);

    // Reset form
    setNewUser({
      name: "",
      email: "",
      roleId: "",
      status: "active",
    });
  };

  const handleUpdateRole = () => {
    // In a real app, this would call an API to update the role
    console.log("Updating role:", editingRole?.id, newRole);
    setRoleDialogOpen(false);
    setEditingRole(null);

    // Reset form
    setNewRole({
      name: "",
      description: "",
      permissions: [],
    });
  };

  const handleDeleteUser = (userId: string) => {
    // In a real app, this would call an API to delete the user
    console.log("Deleting user:", userId);
  };

  const handleDeleteRole = (roleId: string) => {
    // In a real app, this would call an API to delete the role
    console.log("Deleting role:", roleId);
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

  const hasPermission = (resource: ResourceType, action: ActionType) => {
    const permission = newRole.permissions.find((p) => p.resource === resource);
    return permission ? permission.actions.includes(action) : false;
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
                <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={newUser.name}
                            onChange={(e) =>
                              setNewUser({ ...newUser, name: e.target.value })
                            }
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) =>
                              setNewUser({ ...newUser, email: e.target.value })
                            }
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
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
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={newUser.status}
                            onValueChange={(
                              value: "active" | "inactive" | "pending",
                            ) => setNewUser({ ...newUser, status: value })}
                          >
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
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
                              </TableRow>
                            </TableHeader>
                            <TableBody>
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
