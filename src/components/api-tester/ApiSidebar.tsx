import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { ApiCategory } from '@/services/apiTesterService';
import { cn } from '@/lib/utils';

interface ApiSidebarProps {
  categories: ApiCategory[];
  loading: boolean;
  selectedEndpointId: string | null;
  onEndpointSelect: (categoryId: string, endpointId: string) => void;
}

const ApiSidebar: React.FC<ApiSidebarProps> = ({
  categories,
  loading,
  selectedEndpointId,
  onEndpointSelect,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No APIs found</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      {categories.map(category => (
        <div key={category.id} className="mb-2">
          <button
            className="w-full flex items-center justify-between p-2 text-sm font-medium hover:bg-accent rounded-md"
            onClick={() => toggleCategory(category.id)}
          >
            <span>{category.name}</span>
            {expandedCategories[category.id] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedCategories[category.id] && (
            <div className="ml-2 pl-2 border-l mt-1 space-y-1">
              {category.endpoints.map(endpoint => (
                <button
                  key={endpoint.id}
                  className={cn(
                    "w-full flex items-center justify-between p-2 text-sm hover:bg-accent rounded-md",
                    selectedEndpointId === endpoint.id && "bg-accent"
                  )}
                  onClick={() => onEndpointSelect(category.id, endpoint.id)}
                >
                  <div className="flex items-center">
                    <span
                      className={cn(
                        "inline-block w-12 text-xs font-medium mr-2 py-0.5 px-1.5 rounded-sm",
                        endpoint.method === 'GET' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                        endpoint.method === 'POST' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                        endpoint.method === 'PUT' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                        endpoint.method === 'DELETE' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                        endpoint.method === 'PATCH' && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
                        !['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(endpoint.method) && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      )}
                    >
                      {endpoint.method}
                    </span>
                    <span className="truncate">{endpoint.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApiSidebar;
