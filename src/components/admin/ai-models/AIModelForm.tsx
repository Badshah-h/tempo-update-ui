import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AIModel, AiProvider } from '@/types/ai';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ModelTestTab from './ModelTestTab';
import { getAIModel, createAIModel, updateAIModel } from '@/services/aiModelService';
import { getAiProviders } from '@/services/aiModelService';

// Form schema
const formSchema = z.object({
  provider_id: z.coerce.number().min(1, 'Provider is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  max_tokens: z.coerce.number().min(1, 'Max tokens must be at least 1'),
  api_endpoint: z.string().optional(),
  api_key: z.string().min(1, 'API key is required'),
  organization_id: z.string().optional(), // For OpenAI and similar providers
  credentials: z.string().optional(),
  is_active: z.boolean().default(true),
  is_default: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const AIModelForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id && id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [providers, setProviders] = useState<AiProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<AiProvider | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<FormValues>>({
    provider_id: 0,
    name: '',
    slug: '',
    type: '',
    max_tokens: 1024,
    api_endpoint: '',
    api_key: '',
    organization_id: '',
    credentials: JSON.stringify({ api_key: '' }),
    is_active: true,
    is_default: false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getAiProviders();
        setProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load AI providers',
          variant: 'destructive',
        });
      }
    };

    fetchProviders();
  }, [toast]);

  // Handle provider selection to update endpoints and fields
  const handleProviderChange = (providerId: number) => {
    const provider = providers.find(p => p.id === providerId);
    setSelectedProvider(provider || null);

    // Set default API endpoint based on provider
    if (provider) {
      let defaultEndpoint = '';

      // Set default endpoints based on provider
      switch(provider.slug) {
        case 'openai':
          defaultEndpoint = 'https://api.openai.com/v1/chat/completions';
          break;
        case 'google':
          defaultEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
          break;
        case 'anthropic':
          defaultEndpoint = 'https://api.anthropic.com/v1/messages';
          break;
        case 'huggingface':
          defaultEndpoint = 'https://api-inference.huggingface.co/models/';
          break;
      }

      form.setValue('api_endpoint', defaultEndpoint);
    }
  };

  // Fetch model data if editing
  useEffect(() => {
    const fetchModelData = async () => {
      if (!isEditing) return;

      try {
        setLoading(true);
        const model = await getAIModel(parseInt(id as string));

        // Parse credentials if available
        let apiKey = '';
        let organizationId = '';
        let credentials = '{}';

        if (model.credentials) {
          try {
            const credsObj = typeof model.credentials === 'string'
              ? JSON.parse(model.credentials)
              : model.credentials;

            apiKey = credsObj.api_key || '';
            organizationId = credsObj.organization_id || '';
            credentials = typeof model.credentials === 'string'
              ? model.credentials
              : JSON.stringify(model.credentials);
          } catch (e) {
            console.error('Error parsing credentials:', e);
          }
        }

        // Find and set the selected provider
        if (model.provider_id) {
          const provider = providers.find(p => p.id === model.provider_id);
          setSelectedProvider(provider || null);
        }

        const formData = {
          provider_id: model.provider_id,
          name: model.name,
          slug: model.slug,
          type: model.type,
          max_tokens: model.max_tokens,
          api_endpoint: model.api_endpoint || '',
          api_key: apiKey,
          organization_id: organizationId,
          credentials: credentials,
          is_active: model.is_active,
          is_default: model.is_default,
        };

        setInitialValues(formData);
        form.reset(formData);
      } catch (error) {
        console.error('Error fetching model data:', error);
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

    fetchModelData();
  }, [id, isEditing, navigate, toast, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      // Prepare credentials object with API key
      let credentials: Record<string, any> = {};
      try {
        if (data.credentials) {
          credentials = JSON.parse(data.credentials);
        }
      } catch (e) {
        console.error('Error parsing credentials JSON:', e);
        credentials = {};
      }

      // Add API key to credentials
      credentials = {
        ...credentials,
        api_key: data.api_key
      };

      // Add organization_id if provided (for OpenAI)
      if (data.organization_id) {
        credentials.organization_id = data.organization_id;
      }

      // Create submission data
      const submissionData = {
        ...data,
        credentials: JSON.stringify(credentials)
      };

      // Remove api_key and organization_id from top level as they're now in credentials
      delete submissionData.api_key;
      delete submissionData.organization_id;

      if (isEditing) {
        await updateAIModel(parseInt(id as string), submissionData);
        toast({
          title: 'Success',
          description: 'AI model updated successfully',
        });
      } else {
        await createAIModel(submissionData);
        toast({
          title: 'Success',
          description: 'AI model created successfully',
        });
      }

      navigate('/admin/ai-models');
    } catch (error) {
      console.error('Error saving model:', error);
      toast({
        title: 'Error',
        description: 'Failed to save AI model',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit AI Model' : 'Create AI Model'}</h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update an existing AI model' : 'Add a new AI model to your system'}
          </p>
        </div>
      </div>

      {loading && !form.formState.isSubmitting ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="edit">Edit Model</TabsTrigger>
            {isEditing && <TabsTrigger value="test">Test Model</TabsTrigger>}
          </TabsList>

          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit AI Model' : 'Create AI Model'}</CardTitle>
                <CardDescription>
                  Configure your AI model settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="provider_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const providerId = parseInt(value);
                        field.onChange(providerId);
                        handleProviderChange(providerId);
                      }}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id.toString()}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The AI provider for this model
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Model name" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for the model
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="model-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        A unique identifier (auto-generated if empty)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select model type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="chat">Chat</SelectItem>
                          <SelectItem value="embedding">Embedding</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of AI model
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_tokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Tokens</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1024"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum tokens for model responses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="api_endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Endpoint (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Custom API endpoint"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Custom API endpoint (leave empty for default)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="api_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter API key (e.g., sk-...)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The API key for authenticating with the provider
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedProvider?.slug === 'openai' && (
                <FormField
                  control={form.control}
                  name="organization_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization ID (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="org-..."
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        OpenAI Organization ID (if you're using one)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Collapsible className="w-full">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base">Advanced Settings</FormLabel>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
                      {showAdvancedOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      <span className="sr-only">Toggle advanced settings</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="mt-4">
                  <FormField
                    control={form.control}
                    name="credentials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Credentials (JSON)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='{"project_id": "your-project-id"}'
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Advanced: Additional credentials in JSON format (API key will be added automatically)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Enable or disable this model
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Default Model</FormLabel>
                        <FormDescription>
                          Set as the default model
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-between px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/ai-models')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update Model' : 'Create Model'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>

    {isEditing && (
      <TabsContent value="test">
        <ModelTestTab
          model={{
            id: parseInt(id as string),
            name: form.getValues('name'),
            provider_id: form.getValues('provider_id'),
            type: form.getValues('type'),
            max_tokens: form.getValues('max_tokens')
          }}
          toast={toast}
        />
      </TabsContent>
    )}
  </Tabs>
)}
    </div>
  );
};

export default AIModelForm;
