import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import WidgetConfig from "./components/admin/WidgetConfig";
import AIModels from "./components/admin/AIModels";
import PromptTemplates from "./components/admin/PromptTemplates";
import Analytics from "./components/admin/Analytics";
import Settings from "./components/admin/Settings";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="widget" element={<WidgetConfig />} />
            <Route path="models" element={<AIModels />} />
            <Route path="prompts" element={<PromptTemplates />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />

          </Route>
          <Route path="/" element={<Home />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
