import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: React.ReactNode;
}

export const useCustomToast = () => {
  const showToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      const { title, description, duration, action } = options || {};
      
      // Set variant based on type
      const variant = type === "error" ? "destructive" : "default";
      
      // Set default title based on type if not provided
      const defaultTitle = {
        success: "Success",
        error: "Error",
        warning: "Warning",
        info: "Information",
      }[type];
      
      toast({
        variant,
        title: title || defaultTitle,
        description: description || message,
        duration: duration || 3000,
        action,
      });
    },
    []
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast("success", message, options);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast("error", message, options);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast("warning", message, options);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast("info", message, options);
    },
    [showToast]
  );

  return {
    success,
    error,
    warning,
    info,
  };
};
