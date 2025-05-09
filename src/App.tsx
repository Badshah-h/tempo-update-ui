import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import WidgetConfig from "./components/admin/WidgetConfig";
import AIModels from "./components/admin/AIModels";
import AIModelConfig from "./components/admin/AIModelConfig";
import PromptTemplates from "./components/admin/PromptTemplates";
import Analytics from "./components/admin/Analytics";
import Settings from "./components/admin/Settings";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
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
              <Route path="models" element={<AIModels />} />
              <Route path="models/:modelId" element={<AIModelConfig />} />
              <Route path="models/new" element={<AIModelConfig />} />
              <Route path="prompts" element={<PromptTemplates />} />
              <Route path="settings" element={<Settings />} />
              <Route path="analytics" element={<Analytics />} />
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
