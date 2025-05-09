import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  type: "login" | "register";
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  type,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Column - Branding & Info */}
      <div className="w-full md:w-5/12 lg:w-4/12 bg-gradient-to-br from-primary/5 via-primary/10 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        
        <div className="relative h-full flex flex-col justify-between p-8 md:p-12">
          {/* Back to home button */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="group mb-8 hover:bg-background/40"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          {/* Branding */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/5 shadow-sm">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                AI Chat System
              </span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold">
              {type === "login" ? "Welcome back" : "Create an account"}
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-muted-foreground max-w-sm">
              {type === "login"
                ? "Sign in to your account to access your dashboard and manage your AI chat system."
                : "Join us to start building intelligent conversations with your website visitors using our AI chat system."}
            </motion.p>
          </motion.div>
          
          {/* Footer */}
          <div className="text-sm text-muted-foreground mt-auto pt-12">
            <p>© {new Date().getFullYear()} AI Chat System. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Right Column - Form */}
      <div className="w-full md:w-7/12 lg:w-8/12 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
