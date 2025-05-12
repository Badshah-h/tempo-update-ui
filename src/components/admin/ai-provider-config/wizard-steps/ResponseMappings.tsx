import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ResponseMappingsProps {
  responseMappings: Record<string, any>;
  onChange: (responseMappings: Record<string, any>) => void;
}

const ResponseMappings: React.FC<ResponseMappingsProps> = ({ responseMappings, onChange }) => {
  const [activeTab, setActiveTab] = useState('chat');
  
  const handleMappingChange = (type: string, field: string, value: string) => {
    const typeMapping = responseMappings[type] || {};
    
    onChange({
      ...responseMappings,
      [type]: {
        ...typeMapping,
        [field]: value,
      },
    });
  };
  
  // Default mappings for different model types
  const getDefaultMapping = (type: string) => {
    switch (type) {
      case 'chat':
        return {
          content_path: 'choices.0.message.content',
          prompt_tokens_path: 'usage.prompt_tokens',
          completion_tokens_path: 'usage.completion_tokens',
          total_tokens_path: 'usage.total_tokens',
        };
      case 'completion':
        return {
          content_path: 'choices.0.text',
          prompt_tokens_path: 'usage.prompt_tokens',
          completion_tokens_path: 'usage.completion_tokens',
          total_tokens_path: 'usage.total_tokens',
        };
      case 'embedding':
        return {
          embedding_path: 'data.0.embedding',
          prompt_tokens_path: 'usage.prompt_tokens',
          total_tokens_path: 'usage.total_tokens',
        };
      default:
        return {};
    }
  };
  
  const applyDefaultMapping = (type: string) => {
    onChange({
      ...responseMappings,
      [type]: getDefaultMapping(type),
    });
  };
  
  // Ensure all required mappings exist
  const ensureMappingExists = (type: string) => {
    if (!responseMappings[type]) {
      onChange({
        ...responseMappings,
        [type]: {},
      });
    }
  };
  
  // Make sure chat mapping exists
  ensureMappingExists('chat');
  
  // Get fields for the current type
  const getFieldsForType = (type: string) => {
    switch (type) {
      case 'chat':
      case 'completion':
        return [
          { key: 'content_path', label: 'Content Path', placeholder: 'choices.0.message.content' },
          { key: 'prompt_tokens_path', label: 'Prompt Tokens Path', placeholder: 'usage.prompt_tokens' },
          { key: 'completion_tokens_path', label: 'Completion Tokens Path', placeholder: 'usage.completion_tokens' },
          { key: 'total_tokens_path', label: 'Total Tokens Path', placeholder: 'usage.total_tokens' },
        ];
      case 'embedding':
        return [
          { key: 'embedding_path', label: 'Embedding Path', placeholder: 'data.0.embedding' },
          { key: 'prompt_tokens_path', label: 'Prompt Tokens Path', placeholder: 'usage.prompt_tokens' },
          { key: 'total_tokens_path', label: 'Total Tokens Path', placeholder: 'usage.total_tokens' },
        ];
      default:
        return [];
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Mappings</CardTitle>
        <CardDescription>
          Configure how to extract data from the API responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="chat" onClick={() => ensureMappingExists('chat')}>
              Chat
            </TabsTrigger>
            <TabsTrigger value="completion" onClick={() => ensureMappingExists('completion')}>
              Completion
            </TabsTrigger>
            <TabsTrigger value="embedding" onClick={() => ensureMappingExists('embedding')}>
              Embedding
            </TabsTrigger>
          </TabsList>
          
          {['chat', 'completion', 'embedding'].map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>{type.charAt(0).toUpperCase() + type.slice(1)} Response Mapping</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyDefaultMapping(type)}
                >
                  Apply Default Mapping
                </Button>
              </div>
              
              <div className="space-y-4">
                {getFieldsForType(type).map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={`${type}-${field.key}`}>{field.label}</Label>
                    <Input
                      id={`${type}-${field.key}`}
                      value={(responseMappings[type] || {})[field.key] || ''}
                      onChange={(e) => handleMappingChange(type, field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>
              
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium mb-2">Path Format:</p>
                <p>Use dot notation to specify the path to the data in the response JSON.</p>
                <p className="mt-2">Example: <code>choices.0.message.content</code> refers to:</p>
                <pre className="bg-muted-foreground/10 p-2 rounded mt-1 text-xs overflow-auto">
                  {`{
  "choices": [
    {
      "message": {
        "content": "Hello, world!"
      }
    }
  ]
}`}
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResponseMappings;
