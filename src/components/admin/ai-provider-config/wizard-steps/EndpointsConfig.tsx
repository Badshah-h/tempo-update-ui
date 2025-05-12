import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';

interface EndpointsConfigProps {
  endpoints: Record<string, any>;
  onChange: (endpoints: Record<string, any>) => void;
}

const EndpointsConfig: React.FC<EndpointsConfigProps> = ({ endpoints, onChange }) => {
  const handleBaseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...endpoints,
      base_url: e.target.value,
    });
  };

  const handleEndpointChange = (key: string, value: string) => {
    onChange({
      ...endpoints,
      [key]: value,
    });
  };

  const addEndpoint = () => {
    // Generate a unique key for the new endpoint
    let newKey = 'endpoint';
    let counter = 1;
    
    while (endpoints[newKey]) {
      newKey = `endpoint_${counter}`;
      counter++;
    }
    
    onChange({
      ...endpoints,
      [newKey]: '',
    });
  };

  const removeEndpoint = (key: string) => {
    // Don't allow removing base_url or chat
    if (key === 'base_url' || key === 'chat') {
      return;
    }
    
    const newEndpoints = { ...endpoints };
    delete newEndpoints[key];
    onChange(newEndpoints);
  };

  const renameEndpoint = (oldKey: string, newKey: string) => {
    // Don't allow renaming base_url or chat
    if (oldKey === 'base_url' || oldKey === 'chat') {
      return;
    }
    
    // If the new key already exists, don't overwrite it
    if (newKey in endpoints && newKey !== oldKey) {
      return;
    }
    
    const newEndpoints = { ...endpoints };
    const value = newEndpoints[oldKey];
    delete newEndpoints[oldKey];
    newEndpoints[newKey] = value;
    onChange(newEndpoints);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Endpoints Configuration</CardTitle>
        <CardDescription>
          Configure the API endpoints for the AI provider
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="base_url">Base URL</Label>
          <Input
            id="base_url"
            value={endpoints.base_url || ''}
            onChange={handleBaseUrlChange}
            placeholder="https://api.example.com"
          />
          <p className="text-sm text-muted-foreground">
            The base URL for the API (e.g., https://api.openai.com)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chat">Chat Endpoint</Label>
          <Input
            id="chat"
            value={endpoints.chat || ''}
            onChange={(e) => handleEndpointChange('chat', e.target.value)}
            placeholder="v1/chat/completions"
          />
          <p className="text-sm text-muted-foreground">
            The endpoint for chat completions (e.g., v1/chat/completions)
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Additional Endpoints (Optional)</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addEndpoint}
              type="button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Endpoint
            </Button>
          </div>
          
          {Object.entries(endpoints).map(([key, value]) => {
            // Skip base_url and chat as they have their own inputs
            if (key === 'base_url' || key === 'chat') {
              return null;
            }
            
            return (
              <div key={key} className="flex items-center gap-2">
                <Input
                  placeholder="Endpoint name"
                  value={key}
                  onChange={(e) => renameEndpoint(key, e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Endpoint path"
                  value={value as string}
                  onChange={(e) => handleEndpointChange(key, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEndpoint(key)}
                  type="button"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EndpointsConfig;
