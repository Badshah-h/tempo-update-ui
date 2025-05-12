import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProviderConfigWizard from '@/components/admin/ai-provider-config/ProviderConfigWizard';

const AiProviderConfigPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={
        <div className="container mx-auto py-6">
          <Helmet>
            <title>AI Provider Configuration | Admin Dashboard</title>
          </Helmet>
          <ProviderConfigWizard />
        </div>
      } />
    </Routes>
  );
};

export default AiProviderConfigPage;
