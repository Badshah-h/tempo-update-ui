import { useState, useEffect, useCallback } from "react";
import { UserDetails } from "@/types/admin";
import { getCurrentUser, checkPermission, checkIsAdmin } from "@/services/adminService";

export const usePermissions = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        // Check if user is admin
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);

        // Get user data
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
      // If user is admin, always grant permission
      if (isAdmin) {
        return true;
      }

      if (!user) return false;
      return checkPermission(user, resource, action);
    },
    [user, isAdmin],
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
    isAdmin,
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canConfigure,
    canExport,
  };
};
