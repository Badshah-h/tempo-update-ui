import React, { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, History, Settings, Save } from 'lucide-react';
import { ApiCategory, getApiCategories } from '@/services/apiTesterService';
import ApiSidebar from './ApiSidebar';
import RequestPanel from './RequestPanel';
import ResponsePanel from './ResponsePanel';
import EnvironmentPanel from './EnvironmentPanel';
import { ApiRequest, ApiResponse } from '@/services/apiTesterService';

const ApiTesterLayout: React.FC = () => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('request');
  const [request, setRequest] = useState<ApiRequest | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [requestHistory, setRequestHistory] = useState<{
    id: string;
    name: string;
    request: ApiRequest;
  }[]>([]);
  const [environmentVariables, setEnvironmentVariables] = useState<Record<string, string>>({
    token: 'your-auth-token-here',
    baseUrl: 'http://localhost:8000/api',
  });

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const data = await getApiCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching API categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApis();
  }, []);

  const handleEndpointSelect = (categoryId: string, endpointId: string) => {
    setSelectedEndpointId(endpointId);
    
    // Find the selected endpoint
    const category = categories.find(c => c.id === categoryId);
    const endpoint = category?.endpoints.find(e => e.id === endpointId);
    
    if (endpoint) {
      // Create a new request object
      setRequest({
        endpoint,
        parameters: {},
        headers: { ...endpoint.headers } || {},
        body: endpoint.body ? JSON.parse(JSON.stringify(endpoint.body)) : null,
        environmentVariables,
      });
      
      // Reset response
      setResponse(null);
      
      // Switch to request tab
      setActiveTab('request');
    }
  };

  const handleResponseReceived = (response: ApiResponse) => {
    setResponse(response);
    setActiveTab('response');
    
    // Add to history if request exists
    if (request) {
      const historyItem = {
        id: Date.now().toString(),
        name: `${request.endpoint.method} ${request.endpoint.path}`,
        request: { ...request },
      };
      
      setRequestHistory(prev => [historyItem, ...prev]);
    }
  };

  const handleEnvironmentChange = (variables: Record<string, string>) => {
    setEnvironmentVariables(variables);
    
    // Update the current request with new environment variables
    if (request) {
      setRequest({
        ...request,
        environmentVariables: variables,
      });
    }
  };

  const handleHistoryItemSelect = (historyItem: { id: string; name: string; request: ApiRequest }) => {
    setRequest(historyItem.request);
    setSelectedEndpointId(historyItem.request.endpoint.id);
    setActiveTab('request');
  };

  const filteredCategories = searchQuery
    ? categories.map(category => ({
        ...category,
        endpoints: category.endpoints.filter(endpoint =>
          endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          endpoint.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(category => category.endpoints.length > 0)
    : categories;

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 flex justify-between items-center bg-background">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">API Tester</h1>
          <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            Beta
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Collection
          </Button>
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full flex flex-col border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search APIs..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <Tabs defaultValue="apis" className="flex-1 flex flex-col">
                <TabsList className="grid grid-cols-3 mx-4 mt-2">
                  <TabsTrigger value="apis">APIs</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="collections">Collections</TabsTrigger>
                </TabsList>
                
                <TabsContent value="apis" className="flex-1 p-0 m-0">
                  <ScrollArea className="h-full">
                    <ApiSidebar
                      categories={filteredCategories}
                      loading={loading}
                      selectedEndpointId={selectedEndpointId}
                      onEndpointSelect={handleEndpointSelect}
                    />
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="history" className="flex-1 p-0 m-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {requestHistory.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No request history yet</p>
                          <p className="text-sm">Send requests to see them here</p>
                        </div>
                      ) : (
                        requestHistory.map(item => (
                          <div
                            key={item.id}
                            className="p-3 border rounded-md hover:bg-accent cursor-pointer"
                            onClick={() => handleHistoryItemSelect(item)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                item.request.endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                item.request.endpoint.method === 'POST' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                item.request.endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                item.request.endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                              }`}>
                                {item.request.endpoint.method}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 truncate">
                              {item.request.endpoint.path}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="collections" className="flex-1 p-0 m-0">
                  <div className="p-4 text-center py-8 text-muted-foreground">
                    <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Collections coming soon</p>
                    <p className="text-sm">Save and organize your requests</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Main content */}
          <ResizablePanel defaultSize={80}>
            <div className="h-full flex flex-col">
              {request ? (
                <>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                    <div className="border-b px-4">
                      <TabsList className="mt-2">
                        <TabsTrigger value="request">Request</TabsTrigger>
                        <TabsTrigger value="response">Response</TabsTrigger>
                        <TabsTrigger value="environment">Environment</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="request" className="flex-1 p-0 m-0">
                      <RequestPanel
                        request={request}
                        onRequestChange={setRequest}
                        onResponseReceived={handleResponseReceived}
                      />
                    </TabsContent>
                    
                    <TabsContent value="response" className="flex-1 p-0 m-0">
                      <ResponsePanel response={response} />
                    </TabsContent>
                    
                    <TabsContent value="environment" className="flex-1 p-0 m-0">
                      <EnvironmentPanel
                        variables={environmentVariables}
                        onChange={handleEnvironmentChange}
                      />
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md p-8">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Select an API</h2>
                    <p className="text-muted-foreground mb-4">
                      Choose an API endpoint from the sidebar to start testing or create a new request.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Request
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ApiTesterLayout;
