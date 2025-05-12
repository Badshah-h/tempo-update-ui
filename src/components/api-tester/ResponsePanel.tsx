import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Copy, Clock, Database, FileJson } from 'lucide-react';
import { ApiResponse } from '@/services/apiTesterService';
import { Badge } from '@/components/ui/badge';

interface ResponsePanelProps {
  response: ApiResponse | null;
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({ response }) => {
  const [activeTab, setActiveTab] = useState('body');

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    } else if (status >= 300 && status < 400) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    } else if (status >= 400 && status < 500) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    } else if (status >= 500) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    } else {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileJson className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Response Yet</h3>
          <p className="text-muted-foreground">
            Send a request to see the response here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(response.status)}>
              {response.status} {response.statusText}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {response.time}ms
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Database className="h-4 w-4 mr-1" />
              {response.size < 1024
                ? `${response.size} B`
                : `${(response.size / 1024).toFixed(1)} KB`}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(formatJson(response.data))}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Response
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="mt-2">
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="body" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
              {formatJson(response.data)}
            </pre>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="headers" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Header</th>
                    <th className="text-left py-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(response.headers).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 pr-4 font-mono">{key}</td>
                      <td className="py-2 font-mono">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{value}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(value)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponsePanel;
