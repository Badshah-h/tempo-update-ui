import React from "react";
import LoginForm from "../components/auth/LoginForm";
import AuthLayout from "../components/auth/AuthLayout";

const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your credentials below to continue"
      type="login"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
