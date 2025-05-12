import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AIModelsList from '@/components/admin/ai-models/AIModelsList';
import AIModelForm from '@/components/admin/ai-models/AIModelForm';

const AIModelsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={
        <>
          <Helmet>
            <title>AI Models | Admin Dashboard</title>
          </Helmet>
          <AIModelsList />
        </>
      } />
      <Route path="new" element={
        <>
          <Helmet>
            <title>New AI Model | Admin Dashboard</title>
          </Helmet>
          <AIModelForm />
        </>
      } />
      <Route path="edit/:id" element={
        <>
          <Helmet>
            <title>Edit AI Model | Admin Dashboard</title>
          </Helmet>
          <AIModelForm />
        </>
      } />
    </Routes>
  );
};

export default AIModelsPage;
