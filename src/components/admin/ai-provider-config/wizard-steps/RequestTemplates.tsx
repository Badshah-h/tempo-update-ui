import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import JsonEditor from '../JsonEditor';

interface RequestTemplatesProps {
  requestTemplates: Record<string, any>;
  onChange: (requestTemplates: Record<string, any>) => void;
}

const RequestTemplates: React.FC<RequestTemplatesProps> = ({ requestTemplates, onChange }) => {
  const [activeTab, setActiveTab] = useState('chat');
  
  const handleTemplateChange = (type: string, value: Record<string, any>) => {
    onChange({
      ...requestTemplates,
      [type]: value,
    });
  };
  
  // Default templates for different model types
  const getDefaultTemplate = (type: string) => {
    switch (type) {
      case 'chat':
        return {
          model: '{{model}}',
          messages: [
            { role: 'system', content: '{{system_message}}' },
            { role: 'user', content: '{{message}}' }
          ],
          max_tokens: '{{max_tokens}}',
          temperature: '{{temperature}}',
        };
      case 'completion':
        return {
          model: '{{model}}',
          prompt: '{{message}}',
          max_tokens: '{{max_tokens}}',
          temperature: '{{temperature}}',
        };
      case 'embedding':
        return {
          model: '{{model}}',
          input: '{{message}}',
        };
      default:
        return {};
    }
  };
  
  const applyDefaultTemplate = (type: string) => {
    handleTemplateChange(type, getDefaultTemplate(type));
  };
  
  // Ensure all required templates exist
  const ensureTemplateExists = (type: string) => {
    if (!requestTemplates[type]) {
      handleTemplateChange(type, {});
    }
  };
  
  // Make sure chat template exists
  ensureTemplateExists('chat');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Templates</CardTitle>
        <CardDescription>
          Configure the JSON templates for different types of requests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="chat" onClick={() => ensureTemplateExists('chat')}>
              Chat
            </TabsTrigger>
            <TabsTrigger value="completion" onClick={() => ensureTemplateExists('completion')}>
              Completion
            </TabsTrigger>
            <TabsTrigger value="embedding" onClick={() => ensureTemplateExists('embedding')}>
              Embedding
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Chat Request Template</Label>
              <button
                type="button"
                className="text-xs text-primary underline"
                onClick={() => applyDefaultTemplate('chat')}
              >
                Apply Default Template
              </button>
            </div>
            <JsonEditor
              value={requestTemplates.chat || {}}
              onChange={(value) => handleTemplateChange('chat', value)}
              placeholder="Enter the JSON template for chat requests..."
            />
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-2">Available Placeholders:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><code>{'{{model}}'}</code> - The model name/ID</li>
                <li><code>{'{{message}}'}</code> - The user's message</li>
                <li><code>{'{{system_message}}'}</code> - The system prompt</li>
                <li><code>{'{{max_tokens}}'}</code> - Maximum tokens for the response</li>
                <li><code>{'{{temperature}}'}</code> - Temperature setting</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="completion" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Completion Request Template</Label>
              <button
                type="button"
                className="text-xs text-primary underline"
                onClick={() => applyDefaultTemplate('completion')}
              >
                Apply Default Template
              </button>
            </div>
            <JsonEditor
              value={requestTemplates.completion || {}}
              onChange={(value) => handleTemplateChange('completion', value)}
              placeholder="Enter the JSON template for completion requests..."
            />
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-2">Available Placeholders:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><code>{'{{model}}'}</code> - The model name/ID</li>
                <li><code>{'{{message}}'}</code> - The user's message</li>
                <li><code>{'{{max_tokens}}'}</code> - Maximum tokens for the response</li>
                <li><code>{'{{temperature}}'}</code> - Temperature setting</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="embedding" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Embedding Request Template</Label>
              <button
                type="button"
                className="text-xs text-primary underline"
                onClick={() => applyDefaultTemplate('embedding')}
              >
                Apply Default Template
              </button>
            </div>
            <JsonEditor
              value={requestTemplates.embedding || {}}
              onChange={(value) => handleTemplateChange('embedding', value)}
              placeholder="Enter the JSON template for embedding requests..."
            />
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-2">Available Placeholders:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><code>{'{{model}}'}</code> - The model name/ID</li>
                <li><code>{'{{message}}'}</code> - The text to embed</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RequestTemplates;
