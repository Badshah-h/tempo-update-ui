import { useState, useEffect, useCallback } from "react";
import { UserDetails } from "@/types/admin";
import authService from "@/services/authService";

export const usePermissions = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData as unknown as UserDetails);
          setError(null);
        }
      } catch (err) {
        setError(err as Error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (!user || !user.role || !user.role.permissions) return false;

      const permission = user.role.permissions.find(p => p.resource === resource);
      if (!permission) return false;

      return permission.actions.includes(action as any);
    },
    [user],
  );

  const canView = useCallback(
    (resource: string): boolean => {
      return hasPermission(resource, "view");
    },
    [hasPermission],
  );

  const canCreate = useCallback(
    (resource: string): boolean => {
      return hasPermission(resource, "create");
    },
    [hasPermission],
  );

  const canEdit = useCallback(
    (resource: string): boolean => {
      return hasPermission(resource, "edit");
    },
    [hasPermission],
  );

  const canDelete = useCallback(
    (resource: string): boolean => {
      return hasPermission(resource, "delete");
    },
    [hasPermission],
  );

  const canConfigure = useCallback(
    (resource: string): boolean => {
      return hasPermission(resource, "configure");
    },
    [hasPermission],
  );

  const canExport = useCallback(
    (resource: string): boolean => {
      return hasPermission(resource, "export");
    },
    [hasPermission],
  );

  return {
    user,
    loading,
    error,
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canConfigure,
    canExport,
  };
};
