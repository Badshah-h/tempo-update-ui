import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import WidgetConfig from "./components/admin/WidgetConfig";
import AIModels from "./components/admin/AIModels";
import PromptTemplates from "./components/admin/PromptTemplates";
import Analytics from "./components/admin/Analytics";
import Settings from "./components/admin/Settings";
import UserManagement from "./components/admin/UserManagement";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import routes from "tempo-routes";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <RoleProtectedRoute resource="dashboard">
                    <Dashboard />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="widget"
                element={
                  <RoleProtectedRoute resource="widget">
                    <WidgetConfig />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="models"
                element={
                  <RoleProtectedRoute resource="models">
                    <AIModels />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="prompts"
                element={
                  <RoleProtectedRoute resource="prompts">
                    <PromptTemplates />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <RoleProtectedRoute resource="settings">
                    <Settings />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="analytics"
                element={
                  <RoleProtectedRoute resource="analytics">
                    <Analytics />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="users"
                element={
                  <RoleProtectedRoute resource="users">
                    <UserManagement />
                  </RoleProtectedRoute>
                }
              />
            </Route>

            {/* Public Home Route */}
            <Route path="/" element={<Home />} />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
