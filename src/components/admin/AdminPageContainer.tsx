import React from "react";

interface AdminPageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const AdminPageContainer = ({
  children,
  title,
  description,
}: AdminPageContainerProps) => {
  return (
    <div className="w-full px-6 py-6 space-y-8">
      {(title || description) && (
        <div className="flex flex-col gap-2 mb-8">
          {title && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full"></div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{title}</h1>
            </div>
          )}
          {description && (
            <p className="text-muted-foreground ml-3 border-l-2 border-muted pl-4">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
};

export default AdminPageContainer;
