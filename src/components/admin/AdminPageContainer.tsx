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
        <div className="flex flex-col gap-2">
          {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default AdminPageContainer;
