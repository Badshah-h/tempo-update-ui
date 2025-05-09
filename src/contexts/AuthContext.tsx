import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import authService, {
  User,
  LoginData,
  RegisterData,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Changed to a named function declaration for consistent exports
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is already authenticated
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);

          // Verify token is still valid by fetching current user
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (err) {
        console.error("Authentication initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || "Failed to login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || "Failed to register");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log("AuthContext: logout called");
    setLoading(true);
    try {
      console.log("AuthContext: calling authService.logout()");
      await authService.logout();
      console.log("AuthContext: authService.logout() successful");
      setUser(null);
      console.log("AuthContext: user set to null");
    } catch (err: any) {
      console.error("AuthContext: logout error", err);
      setError(err.message || "Failed to logout");
    } finally {
      setLoading(false);
      console.log("AuthContext: logout complete, loading set to false");
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export useAuth as a named export
export { useAuth };
