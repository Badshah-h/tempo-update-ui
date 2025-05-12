import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';

interface AuthConfigProps {
  authConfig: Record<string, any>;
  onChange: (authConfig: Record<string, any>) => void;
}

const AuthConfig: React.FC<AuthConfigProps> = ({ authConfig, onChange }) => {
  const handleAuthTypeChange = (value: string) => {
    onChange({
      ...authConfig,
      type: value,
    });
  };

  const handleKeyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...authConfig,
      key_name: e.target.value,
    });
  };

  const addCustomHeader = () => {
    const customHeaders = authConfig.custom_headers || {};
    onChange({
      ...authConfig,
      custom_headers: {
        ...customHeaders,
        '': '',
      },
    });
  };

  const updateCustomHeader = (oldKey: string, newKey: string, value: string) => {
    const customHeaders = { ...authConfig.custom_headers } || {};
    
    // Remove old key if it's being changed
    if (oldKey !== newKey && oldKey in customHeaders) {
      delete customHeaders[oldKey];
    }
    
    // Add new key-value pair
    customHeaders[newKey] = value;
    
    onChange({
      ...authConfig,
      custom_headers: customHeaders,
    });
  };

  const removeCustomHeader = (key: string) => {
    const customHeaders = { ...authConfig.custom_headers } || {};
    delete customHeaders[key];
    
    onChange({
      ...authConfig,
      custom_headers: customHeaders,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Configuration</CardTitle>
        <CardDescription>
          Configure how your application will authenticate with the AI provider
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Authentication Method</Label>
          <RadioGroup
            value={authConfig.type || 'bearer'}
            onValueChange={handleAuthTypeChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bearer" id="bearer" />
              <Label htmlFor="bearer" className="font-normal">
                Bearer Token (Authorization: Bearer YOUR_API_KEY)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="header" id="header" />
              <Label htmlFor="header" className="font-normal">
                Header (X-API-Key: YOUR_API_KEY)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="query" id="query" />
              <Label htmlFor="query" className="font-normal">
                Query Parameter (?api_key=YOUR_API_KEY)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="key_name">
            {authConfig.type === 'bearer' ? 'Authorization Header Name' : 
             authConfig.type === 'header' ? 'Header Name' : 
             'Query Parameter Name'}
          </Label>
          <Input
            id="key_name"
            value={authConfig.key_name || ''}
            onChange={handleKeyNameChange}
            placeholder={
              authConfig.type === 'bearer' ? 'Authorization' : 
              authConfig.type === 'header' ? 'X-API-Key' : 
              'api_key'
            }
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Additional Headers (Optional)</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addCustomHeader}
              type="button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Header
            </Button>
          </div>
          
          {authConfig.custom_headers && Object.entries(authConfig.custom_headers).map(([key, value], index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Header name"
                value={key}
                onChange={(e) => updateCustomHeader(key, e.target.value, value as string)}
                className="flex-1"
              />
              <Input
                placeholder="Value"
                value={value as string}
                onChange={(e) => updateCustomHeader(key, key, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCustomHeader(key)}
                type="button"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthConfig;
