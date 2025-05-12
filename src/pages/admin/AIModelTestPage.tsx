import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Zap, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getAIModel, testAiModel } from '@/services/aiModelService';

interface TestResponse {
  content: string;
  metadata: {
    response_time: number;
    tokens_used: number;
    estimated_cost: number;
  };
}

const AIModelTestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<any>(null);
  const [testQuery, setTestQuery] = useState(
    "What are the key features of your AI chat system?"
  );
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    const fetchModel = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const modelData = await getAIModel(parseInt(id));
        setModel(modelData);
      } catch (error) {
        console.error('Error fetching model:', error);
        toast({
          title: 'Error',
          description: 'Failed to load AI model data',
          variant: 'destructive',
        });
        navigate('/admin/ai-models');
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id, navigate, toast]);

  const handleRunTest = async () => {
    if (!testQuery || !id) return;

    try {
      setTestLoading(true);
      const response = await testAiModel(id, testQuery);
      setTestResponse(response);
    } catch (error) {
      console.error(`Failed to test model ${id}:`, error);
      toast({
        variant: 'destructive',
        title: 'Test failed',
        description: 'Failed to test AI model. Please try again later.',
      });
    } finally {
      setTestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Test AI Model | Admin Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/ai-models')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Test AI Model: {model?.name}</h2>
            <p className="text-muted-foreground">
              Try out the model with sample queries
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Model</CardTitle>
            <CardDescription>
              Enter a query to test how the model responds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="testQuery">Test Query</Label>
              <Textarea
                id="testQuery"
                placeholder="Enter a test query here..."
                rows={5}
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button
                className="gap-2"
                onClick={handleRunTest}
                disabled={testLoading}
              >
                {testLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                Run Test
              </Button>
            </div>

            {testResponse && (
              <>
                <Separator />

                <div className="space-y-2">
                  <Label>Response</Label>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="whitespace-pre-wrap">
                      {testResponse.content}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Response Time</div>
                    <div className="text-xl font-bold">
                      {testResponse.metadata.response_time}s
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Tokens Used</div>
                    <div className="text-xl font-bold">
                      {testResponse.metadata.tokens_used}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Estimated Cost</div>
                    <div className="text-xl font-bold">
                      ${testResponse.metadata.estimated_cost.toFixed(6)}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AIModelTestPage;
