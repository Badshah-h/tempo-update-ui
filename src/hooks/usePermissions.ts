import { useState, useEffect, useCallback } from "react";
import { UserDetails } from "@/types/admin";
import { getCurrentUser, checkPermission } from "@/services/adminService";

export const usePermissions = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
        setError(null);
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
      if (!user) return false;
      return checkPermission(user, resource, action);
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
