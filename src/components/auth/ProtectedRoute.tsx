import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // TEMPORARY: Authentication check bypassed for development purposes
  // IMPORTANT: Re-enable this code before production deployment
  /*
  if (loading) {
    // You could render a loading spinner here
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  */

  // TEMPORARY: All routes are publicly accessible

  return <>{children}</>;
};

export default ProtectedRoute;
