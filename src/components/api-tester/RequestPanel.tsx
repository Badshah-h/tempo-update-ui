import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Plus, Trash2, Copy, Loader2 } from 'lucide-react';
import { ApiRequest, ApiResponse, executeRequest } from '@/services/apiTesterService';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface RequestPanelProps {
  request: ApiRequest;
  onRequestChange: (request: ApiRequest) => void;
  onResponseReceived: (response: ApiResponse) => void;
}

const RequestPanel: React.FC<RequestPanelProps> = ({
  request,
  onRequestChange,
  onResponseReceived,
}) => {
  const [activeTab, setActiveTab] = useState('params');
  const [isExecuting, setIsExecuting] = useState(false);
  const [bodyFormat, setBodyFormat] = useState<'json' | 'text'>(
    typeof request.body === 'object' ? 'json' : 'text'
  );

  const handleParamChange = (name: string, value: string) => {
    onRequestChange({
      ...request,
      parameters: {
        ...request.parameters,
        [name]: value,
      },
    });
  };

  const handleHeaderChange = (index: number, key: string, value: string) => {
    const headers = { ...request.headers };
    
    // Get the old key at this index
    const oldKey = Object.keys(headers)[index];
    
    // If the key has changed, delete the old key
    if (oldKey !== key && oldKey) {
      delete headers[oldKey];
    }
    
    // Set the new key-value pair
    headers[key] = value;
    
    onRequestChange({
      ...request,
      headers,
    });
  };

  const addHeader = () => {
    onRequestChange({
      ...request,
      headers: {
        ...request.headers,
        '': '',
      },
    });
  };

  const removeHeader = (key: string) => {
    const headers = { ...request.headers };
    delete headers[key];
    
    onRequestChange({
      ...request,
      headers,
    });
  };

  const handleBodyChange = (value: string) => {
    if (bodyFormat === 'json') {
      try {
        // Try to parse as JSON
        const jsonBody = JSON.parse(value);
        onRequestChange({
          ...request,
          body: jsonBody,
        });
      } catch (error) {
        // If it's not valid JSON, just store as string
        onRequestChange({
          ...request,
          body: value,
        });
      }
    } else {
      onRequestChange({
        ...request,
        body: value,
      });
    }
  };

  const formatBody = () => {
    if (bodyFormat === 'json' && typeof request.body === 'object') {
      return JSON.stringify(request.body, null, 2);
    }
    return typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    
    try {
      const response = await executeRequest(request);
      onResponseReceived(response);
    } catch (error) {
      console.error('Error executing request:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'POST': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'PATCH': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-4">
          <Badge className={getMethodColor(request.endpoint.method)}>
            {request.endpoint.method}
          </Badge>
          <h2 className="text-lg font-semibold">{request.endpoint.name}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={request.endpoint.path}
              readOnly
              className="pr-20 font-mono text-sm"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-6"
              onClick={() => navigator.clipboard.writeText(request.endpoint.path)}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          
          <Button
            onClick={handleExecute}
            disabled={isExecuting}
            className="min-w-[100px]"
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
        
        {request.endpoint.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {request.endpoint.description}
          </p>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="mt-2">
            <TabsTrigger value="params">Params</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="params" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {request.endpoint.parameters && request.endpoint.parameters.length > 0 ? (
                <div className="space-y-4">
                  {request.endpoint.parameters
                    .filter(param => param.type === 'path' || param.type === 'query')
                    .map(param => (
                      <div key={param.name} className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor={`param-${param.name}`} className="flex-1">
                            {param.name}
                            {param.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          <Badge variant="outline" className="ml-2">
                            {param.type}
                          </Badge>
                        </div>
                        <Input
                          id={`param-${param.name}`}
                          value={request.parameters[param.name] || param.defaultValue || ''}
                          onChange={(e) => handleParamChange(param.name, e.target.value)}
                          placeholder={`Enter ${param.name}...`}
                        />
                        {param.description && (
                          <p className="text-xs text-muted-foreground">{param.description}</p>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No parameters for this endpoint</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="headers" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {Object.keys(request.headers).length > 0 ? (
                Object.entries(request.headers).map(([key, value], index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={key}
                      onChange={(e) => handleHeaderChange(index, e.target.value, value)}
                      placeholder="Header name"
                      className="flex-1"
                    />
                    <Input
                      value={value}
                      onChange={(e) => handleHeaderChange(index, key, e.target.value)}
                      placeholder="Value"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHeader(key)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No headers defined</p>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={addHeader}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Header
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="body" className="flex-1 p-0 m-0">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="space-x-2">
              <Button
                variant={bodyFormat === 'json' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBodyFormat('json')}
              >
                JSON
              </Button>
              <Button
                variant={bodyFormat === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBodyFormat('text')}
              >
                Text
              </Button>
            </div>
            
            {bodyFormat === 'json' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (typeof request.body === 'object') {
                    handleBodyChange(JSON.stringify(request.body, null, 2));
                  }
                }}
              >
                Format JSON
              </Button>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <Textarea
              value={formatBody()}
              onChange={(e) => handleBodyChange(e.target.value)}
              placeholder={bodyFormat === 'json' ? '{\n  "key": "value"\n}' : 'Enter request body...'}
              className="h-full font-mono text-sm"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestPanel;
