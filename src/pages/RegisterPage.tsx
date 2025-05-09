import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import AuthLayout from "../components/auth/AuthLayout";

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Fill in your details to get started"
      type="register"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
