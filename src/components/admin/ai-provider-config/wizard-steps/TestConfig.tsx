import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AiProvider, AiProviderConfig } from '@/types/ai';

interface TestConfigProps {
  providerData: Partial<AiProvider>;
  configData: Partial<AiProviderConfig>;
}

const TestConfig: React.FC<TestConfigProps> = ({ providerData, configData }) => {
  const [apiKey, setApiKey] = useState('');
  const [testQuery, setTestQuery] = useState('Explain what an AI adapter is in one paragraph.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    response?: string;
    error?: string;
    metrics?: {
      time: string;
      tokens: number;
      cost: number;
    };
  } | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    
    // In a real implementation, this would call the API to test the configuration
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Simulate a successful response
      if (apiKey && configData.auth_config && configData.endpoints && configData.request_templates) {
        setResult({
          success: true,
          response: "An AI adapter is a software component that provides a standardized interface between your application and various AI service providers. It abstracts away the specific implementation details of each provider's API, allowing your application to interact with different AI models in a consistent way. This pattern enables you to easily switch between providers or use multiple providers simultaneously without changing your core application code, while handling authentication, request formatting, response parsing, and error management in a unified manner.",
          metrics: {
            time: '1.2s',
            tokens: 78,
            cost: 0.00016,
          },
        });
      } else {
        // Simulate an error response
        setResult({
          success: false,
          error: 'Missing required configuration. Please ensure you have provided an API key and configured authentication, endpoints, and request templates.',
        });
      }
      
      setLoading(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Configuration</CardTitle>
        <CardDescription>
          Test your AI provider configuration with a sample query
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="api_key">API Key</Label>
          <Input
            id="api_key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key for testing"
          />
          <p className="text-sm text-muted-foreground">
            This key is only used for testing and won't be stored
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="test_query">Test Query</Label>
          <Textarea
            id="test_query"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Enter a test query..."
            rows={3}
          />
        </div>

        <Button
          onClick={handleTest}
          disabled={loading || !apiKey || !testQuery}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Test Configuration
            </>
          )}
        </Button>

        {result && (
          <div className="mt-6 space-y-4">
            {result.success ? (
              <>
                <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
                  <AlertTitle className="text-green-800 dark:text-green-300">Success!</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Your configuration is working correctly.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Response:</h4>
                  <p className="text-sm">{result.response}</p>
                </div>
                
                {result.metrics && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-medium">{result.metrics.time}</p>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Tokens</p>
                      <p className="font-medium">{result.metrics.tokens}</p>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Cost</p>
                      <p className="font-medium">${result.metrics.cost.toFixed(6)}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="bg-muted p-4 rounded-md text-sm">
          <h4 className="font-medium mb-2">Configuration Summary:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Provider:</strong> {providerData.name || 'Not set'}</li>
            <li><strong>Auth Type:</strong> {configData.auth_config?.type || 'Not set'}</li>
            <li><strong>Base URL:</strong> {configData.endpoints?.base_url || 'Not set'}</li>
            <li><strong>Chat Endpoint:</strong> {configData.endpoints?.chat || 'Not set'}</li>
            <li><strong>Request Template:</strong> {configData.request_templates?.chat ? 'Configured' : 'Not set'}</li>
            <li><strong>Response Mapping:</strong> {configData.response_mappings?.chat ? 'Configured' : 'Not set'}</li>
            <li><strong>Streaming:</strong> {configData.stream_config?.enabled !== false ? 'Enabled' : 'Disabled'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestConfig;
