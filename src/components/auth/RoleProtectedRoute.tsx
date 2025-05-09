import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";
import { ResourceType, ActionType } from "../../types/admin";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  resource: ResourceType;
  action?: ActionType;
  redirectTo?: string;
}

/**
 * A route component that protects routes based on user authentication and permissions
 * 
 * @param children - The component to render if the user has permission
 * @param resource - The resource the user needs permission to access
 * @param action - The action the user needs permission to perform (defaults to "view")
 * @param redirectTo - Where to redirect if the user doesn't have permission (defaults to "/login")
 */
const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  resource,
  action = "view",
  redirectTo = "/login",
}) => {
  const { isAuthenticated, loading } = useAuth();
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const location = useLocation();

  // Show loading state while checking authentication and permissions
  if (loading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated but doesn't have permission, redirect to dashboard or access denied page
  if (!hasPermission(resource, action)) {
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
  }

  // If authenticated and has permission, render the children
  return <>{children}</>;
};

export default RoleProtectedRoute;
