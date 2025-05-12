import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EnvironmentPanelProps {
  variables: Record<string, string>;
  onChange: (variables: Record<string, string>) => void;
}

const EnvironmentPanel: React.FC<EnvironmentPanelProps> = ({ variables, onChange }) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [hiddenValues, setHiddenValues] = useState<Record<string, boolean>>({});

  const handleAddVariable = () => {
    if (!newKey.trim()) return;
    
    onChange({
      ...variables,
      [newKey]: newValue,
    });
    
    setNewKey('');
    setNewValue('');
  };

  const handleRemoveVariable = (key: string) => {
    const newVariables = { ...variables };
    delete newVariables[key];
    onChange(newVariables);
  };

  const handleUpdateVariable = (key: string, value: string) => {
    onChange({
      ...variables,
      [key]: value,
    });
  };

  const toggleValueVisibility = (key: string) => {
    setHiddenValues(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>
              Define variables that can be used in your requests. Use the format <code>{'{{variableName}}'}</code> in your requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {Object.entries(variables).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Input
                    value={key}
                    readOnly
                    className="flex-1"
                  />
                  <div className="flex-1 relative">
                    <Input
                      type={hiddenValues[key] ? 'password' : 'text'}
                      value={value}
                      onChange={(e) => handleUpdateVariable(key, e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => toggleValueVisibility(key)}
                    >
                      {hiddenValues[key] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveVariable(key)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <Label className="mb-2 block">Add New Variable</Label>
              <div className="flex items-end space-x-2">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Variable name"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddVariable}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              Here's how to use environment variables in your requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">In Headers</h3>
              <pre className="bg-muted p-2 rounded-md text-xs">
                {`Authorization: Bearer {{token}}`}
              </pre>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">In URL</h3>
              <pre className="bg-muted p-2 rounded-md text-xs">
                {`{{baseUrl}}/users/{id}`}
              </pre>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">In Body</h3>
              <pre className="bg-muted p-2 rounded-md text-xs">
                {`{
  "apiKey": "{{apiKey}}",
  "userId": 123
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Environment
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default EnvironmentPanel;
