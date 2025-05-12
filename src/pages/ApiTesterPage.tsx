import React from 'react';
import { Helmet } from 'react-helmet-async';
import ApiTesterLayout from '@/components/api-tester/ApiTesterLayout';

const ApiTesterPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>API Tester | Developer Tools</title>
      </Helmet>
      <div className="h-screen flex flex-col">
        <ApiTesterLayout />
      </div>
    </>
  );
};

export default ApiTesterPage;
