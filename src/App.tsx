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
import AIModelsPage from "./pages/admin/AIModelsPage";
import AIModelTestPage from "./pages/admin/AIModelTestPage";
import AiProviderConfigPage from "./pages/admin/AiProviderConfigPage";
import ApiTesterPage from "./pages/ApiTesterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
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

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="widget" element={<WidgetConfig />} />
              {/* Legacy AI Models implementation - commented out as requested */}
              {/* <Route path="models" element={<AIModels />} /> */}
              {/* New AI Models implementation */}
              <Route path="ai-models/*" element={<AIModelsPage />} />
              <Route path="ai-models/test/:id" element={<AIModelTestPage />} />
              {/* AI Provider Configuration */}
              <Route path="ai-provider-config/*" element={<AiProviderConfigPage />} />
              <Route path="prompts" element={<PromptTemplates />} />
              <Route path="settings" element={<Settings />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="users" element={<UserManagement />} />
            </Route>

            {/* Public Home Route */}
            <Route path="/" element={<Home />} />

            {/* API Tester Route */}
            <Route path="/api-tester" element={<ApiTesterPage />} />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
