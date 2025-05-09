import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Brain,
  Zap,
  Settings,
  Save,
  ArrowLeft,
  Key,
  Sliders,
  MessageSquare,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import AdminPageContainer from "./AdminPageContainer";
import { getAIModel, updateAIModel } from "@/services/adminService";
import { AIModel } from "@/types/admin";

// Form validation schema
const modelFormSchema = z.object({
  name: z.string().min(1, { message: "Model name is required" }),
  provider: z.string().min(1, { message: "Provider is required" }),
  type: z.string().min(1, { message: "Model type is required" }),
  status: z.enum(["active", "inactive"]),
  apiKey: z.string().min(1, { message: "API key is required" }),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1),
  topP: z.number().min(0).max(1),
  presencePenalty: z.number().min(-2).max(2),
  systemPrompt: z.string(),
});

type ModelFormValues = z.infer<typeof modelFormSchema>;

const AIModelConfig = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const [model, setModel] = useState<AIModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testQuery, setTestQuery] = useState(
    "What are the key features of your AI chat system?",
  );
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testMetrics, setTestMetrics] = useState<{
    time: string;
    tokens: number;
    cost: string;
  } | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: "",
      provider: "",
      type: "",
      status: "active" as const,
      apiKey: "",
      temperature: 0.7,
      maxTokens: 1024,
      topP: 0.9,
      presencePenalty: 0,
      systemPrompt:
        "You are a helpful AI assistant for our company. Answer questions accurately and concisely based on the provided context. If you don't know the answer, say so rather than making up information.",
    },
  });

  useEffect(() => {
    const fetchModel = async () => {
      if (!modelId) return;

      setLoading(true);
      try {
        const modelData = await getAIModel(modelId);
        if (modelData) {
          setModel(modelData);

          // Set form values
          form.reset({
            name: modelData.name,
            provider: modelData.provider,
            type: modelData.type,
            status: modelData.status,
            apiKey: modelData.apiKey,
            temperature: 0.7, // Default values for fields not in the model type
            maxTokens: 1024,
            topP: 0.9,
            presencePenalty: 0,
            systemPrompt:
              "You are a helpful AI assistant for our company. Answer questions accurately and concisely based on the provided context. If you don't know the answer, say so rather than making up information.",
          });
        }
      } catch (error) {
        console.error("Error fetching model:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load model configuration.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [modelId, form, toast]);

  const onSubmit = async (data: ModelFormValues) => {
    if (!modelId) return;

    setSaving(true);
    try {
      await updateAIModel(modelId, data);
      toast({
        title: "Success",
        description: "Model configuration saved successfully.",
      });
    } catch (error) {
      console.error("Error saving model:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save model configuration.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestModel = async () => {
    setTestLoading(true);
    try {
      // In a real app, this would call the AI model API
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      setTestResponse(
        "Our AI chat system offers several key features:\n\n" +
          "1. Context-aware AI responses that understand user queries\n" +
          "2. Multiple integration options (iFrame and Web Component)\n" +
          "3. Real-time communication via WebSockets\n" +
          "4. Comprehensive admin dashboard for configuration\n" +
          "5. Support for multiple AI models (Gemini and Hugging Face)\n" +
          "6. Customizable appearance to match your brand\n" +
          "7. Analytics and performance monitoring\n\n" +
          "Would you like more information about any specific feature?",
      );

      setTestMetrics({
        time: "1.3s",
        tokens: 217,
        cost: "$0.00043",
      });
    } catch (error) {
      console.error("Error testing model:", error);
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: "Failed to test the model. Please try again.",
      });
    } finally {
      setTestLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminPageContainer
        title="AI Model Configuration"
        description="Loading model details..."
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminPageContainer>
    );
  }

  if (!model && !loading) {
    return (
      <AdminPageContainer
        title="AI Model Configuration"
        description="Configure and manage AI model settings"
      >
        <Card>
          <CardHeader>
            <CardTitle>Model Not Found</CardTitle>
            <CardDescription>
              The requested AI model could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please check the model ID and try again.</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/models")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Models
            </Button>
          </CardFooter>
        </Card>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer
      title={`Configure ${model?.name || "AI Model"}`}
      description="Manage detailed settings for this AI model"
      backLink="/admin/models"
      backLinkText="Back to Models"
    >
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span>Advanced</span>
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Testing</span>
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="general" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure basic model information and connection settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Gemini Pro" {...field} />
                          </FormControl>
                          <FormDescription>
                            A descriptive name for this AI model
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="provider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Google">Google</SelectItem>
                              <SelectItem value="Hugging Face">
                                Hugging Face
                              </SelectItem>
                              <SelectItem value="OpenAI">OpenAI</SelectItem>
                              <SelectItem value="Anthropic">
                                Anthropic
                              </SelectItem>
                              <SelectItem value="Custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The company or organization providing this model
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model Type</FormLabel>
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
                              <SelectItem value="Large Language Model">
                                Large Language Model
                              </SelectItem>
                              <SelectItem value="Text-to-Text">
                                Text-to-Text
                              </SelectItem>
                              <SelectItem value="Fine-tuned GPT">
                                Fine-tuned GPT
                              </SelectItem>
                              <SelectItem value="Embedding Model">
                                Embedding Model
                              </SelectItem>
                              <SelectItem value="Custom">Custom</SelectItem>
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
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Status</FormLabel>
                          <div className="flex items-center gap-4 pt-2">
                            <FormControl>
                              <Switch
                                checked={field.value === "active"}
                                onCheckedChange={(checked) =>
                                  field.onChange(
                                    checked ? "active" : "inactive",
                                  )
                                }
                              />
                            </FormControl>
                            <div className="space-y-0.5">
                              <FormDescription>
                                {field.value === "active"
                                  ? "Model is active and available for use"
                                  : "Model is inactive and unavailable"}
                              </FormDescription>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <div className="relative w-full">
                              <Input
                                type="password"
                                placeholder="Enter API key"
                                {...field}
                              />
                              <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              toast({
                                title: "API Key Regenerated",
                                description:
                                  "A new API key has been generated.",
                              });
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormDescription>
                          The API key used to authenticate with the provider
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Fine-tune model parameters and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Model Parameters</h3>

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temperature</FormLabel>
                            <div className="flex items-center gap-4">
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.1}
                                  value={[field.value]}
                                  onValueChange={(value) =>
                                    field.onChange(value[0])
                                  }
                                  className="flex-1"
                                />
                              </FormControl>
                              <span className="w-12 text-center">
                                {field.value.toFixed(1)}
                              </span>
                            </div>
                            <FormDescription>
                              Controls randomness: lower values are more
                              deterministic
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxTokens"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Tokens</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum number of tokens to generate
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="topP"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Top P</FormLabel>
                            <div className="flex items-center gap-4">
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.05}
                                  value={[field.value]}
                                  onValueChange={(value) =>
                                    field.onChange(value[0])
                                  }
                                  className="flex-1"
                                />
                              </FormControl>
                              <span className="w-12 text-center">
                                {field.value.toFixed(2)}
                              </span>
                            </div>
                            <FormDescription>
                              Nucleus sampling: only consider tokens with top_p
                              probability mass
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="presencePenalty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Presence Penalty</FormLabel>
                            <div className="flex items-center gap-4">
                              <FormControl>
                                <Slider
                                  min={-2}
                                  max={2}
                                  step={0.1}
                                  value={[field.value]}
                                  onValueChange={(value) =>
                                    field.onChange(value[0])
                                  }
                                  className="flex-1"
                                />
                              </FormControl>
                              <span className="w-12 text-center">
                                {field.value.toFixed(1)}
                              </span>
                            </div>
                            <FormDescription>
                              Penalizes repeated tokens: higher values increase
                              diversity
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="systemPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Enter system instructions for the AI model"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Default instructions that define the behavior and
                          capabilities of the AI
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Usage Limits</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="dailyLimit">Daily Request Limit</Label>
                        <Input
                          id="dailyLimit"
                          type="number"
                          defaultValue={1000}
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum number of requests per day (0 for unlimited)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="costCap">Monthly Cost Cap ($)</Label>
                        <Input id="costCap" type="number" defaultValue={50} />
                        <p className="text-xs text-muted-foreground">
                          Maximum monthly spending for this model
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Model</CardTitle>
                  <CardDescription>
                    Try out the model with sample queries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="testQuery">Test Query</Label>
                    <Textarea
                      id="testQuery"
                      placeholder="Enter a test query here..."
                      rows={3}
                      value={testQuery}
                      onChange={(e) => setTestQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleTestModel}
                      disabled={testLoading}
                      className="gap-2"
                    >
                      {testLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          Run Test
                        </>
                      )}
                    </Button>
                  </div>

                  {testResponse && (
                    <>
                      <Separator />

                      <div className="space-y-2">
                        <Label>Response</Label>
                        <div className="p-4 bg-muted rounded-md">
                          <p className="whitespace-pre-wrap">{testResponse}</p>
                        </div>
                      </div>

                      {testMetrics && (
                        <div className="grid gap-6 md:grid-cols-3">
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              Response Time
                            </div>
                            <div className="text-xl font-bold">
                              {testMetrics.time}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              Tokens Used
                            </div>
                            <div className="text-xl font-bold">
                              {testMetrics.tokens}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              Estimated Cost
                            </div>
                            <div className="text-xl font-bold">
                              {testMetrics.cost}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </AdminPageContainer>
  );
};

export default AIModelConfig;
