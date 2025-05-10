import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminPageContainer from "./AdminPageContainer";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Brain,
  Zap,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  BarChart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  getModels,
  deleteModel,
  toggleModelStatus,
  testModel,
} from "@/services/aiModelService";
import type { AIModel } from "@/services/aiModelService";

const AIModels = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModel, setActiveModel] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<number | null>(null);
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

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const fetchedModels = await getModels();
      setModels(fetchedModels);
      if (fetchedModels.length > 0) {
        setActiveModel(fetchedModels[0].id);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load AI models. Please try again.",
      });
      // Use mock data as fallback
      const mockModels = [
        {
          id: 1,
          provider_id: 1,
          name: "Gemini Pro",
          slug: "gemini-pro",
          type: "Large Language Model",
          capabilities: ["text-generation", "chat", "summarization"],
          context_types: ["general", "technical", "creative"],
          max_tokens: 8192,
          api_endpoint: "https://api.example.com/v1/gemini-pro",
          default_parameters: { temperature: 0.7, top_p: 0.9 },
          system_prompt: "You are a helpful AI assistant...",
          is_active: true,
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          provider: {
            id: 1,
            name: "Google",
            slug: "google",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
        {
          id: 2,
          provider_id: 2,
          name: "T5 Large",
          slug: "huggingface-t5",
          type: "Text-to-Text",
          capabilities: ["text-generation", "summarization"],
          context_types: ["general", "technical"],
          max_tokens: 4096,
          api_endpoint: "https://api.example.com/v1/t5-large",
          default_parameters: { temperature: 0.5, top_p: 0.8 },
          system_prompt: "You are a helpful AI assistant...",
          is_active: true,
          is_default: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          provider: {
            id: 2,
            name: "Hugging Face",
            slug: "huggingface",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
        {
          id: 3,
          provider_id: 3,
          name: "Custom Fine-tuned",
          slug: "custom-finetune",
          type: "Fine-tuned GPT",
          capabilities: ["text-generation", "chat", "code-generation"],
          context_types: ["technical", "code", "general"],
          max_tokens: 8192,
          api_endpoint: "https://api.example.com/v1/custom-finetune",
          default_parameters: { temperature: 0.8, top_p: 0.95 },
          system_prompt: "You are a helpful AI assistant...",
          is_active: false,
          is_default: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          provider: {
            id: 3,
            name: "OpenAI",
            slug: "openai",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      ];
      setModels(mockModels as AIModel[]);
      setActiveModel(mockModels[0].id);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (modelId: number) => {
    setModelToDelete(modelId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!modelToDelete) return;

    setSaving(true);
    try {
      await deleteModel(modelToDelete);
      setModels(models.filter((model) => model.id !== modelToDelete));
      toast({
        title: "Success",
        description: "Model deleted successfully.",
      });
      if (activeModel === modelToDelete) {
        setActiveModel(models.length > 1 ? models[0].id : null);
      }
    } catch (error) {
      console.error(`Error deleting model ${modelToDelete}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete model. Please try again.",
      });
    } finally {
      setSaving(false);
      setShowDeleteDialog(false);
      setModelToDelete(null);
    }
  };

  const handleToggleStatus = async (
    modelId: number,
    currentStatus: boolean,
  ) => {
    try {
      await toggleModelStatus(modelId);
      setModels(
        models.map((model) =>
          model.id === modelId
            ? { ...model, is_active: !currentStatus }
            : model,
        ),
      );
      toast({
        title: "Success",
        description: `Model ${currentStatus ? "deactivated" : "activated"} successfully.`,
      });
    } catch (error) {
      console.error(`Error toggling model status ${modelId}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update model status. Please try again.",
      });
    }
  };

  const handleTestModel = async () => {
    if (!activeModel) return;

    setTestLoading(true);
    setTestResponse(null);
    setTestMetrics(null);

    try {
      const result = await testModel(activeModel, testQuery);
      setTestResponse(result.response);
      setTestMetrics({
        time: `${result.metrics.time_taken.toFixed(1)}s`,
        tokens: result.metrics.tokens_used,
        cost: `$${result.metrics.estimated_cost.toFixed(5)}`,
      });
    } catch (error) {
      console.error(`Error testing model ${activeModel}:`, error);
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: "Failed to test the model. Please try again.",
      });

      // Fallback to mock response
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
    } finally {
      setTestLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <AdminPageContainer
      title="AI Models"
      description="Configure and manage the AI models used by your chat system."
    >
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-64 lg:w-72">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Models</CardTitle>
              <CardDescription>Available AI models</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchModels}
              disabled={loading}
              title="Refresh models"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : models.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>No AI models found</p>
                <p className="text-sm mt-2">
                  Click the button below to add your first model
                </p>
              </div>
            ) : (
              <motion.div
                className="flex flex-col"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {models.map((model) => (
                  <motion.div key={model.id} variants={itemVariants}>
                    <button
                      className={`w-full flex items-center justify-between p-3 text-left hover:bg-muted transition-colors ${activeModel === model.id ? "bg-muted" : ""}`}
                      onClick={() => setActiveModel(model.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Brain
                          className={`h-5 w-5 ${activeModel === model.id ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {model.provider?.name || "Unknown Provider"}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={model.is_active ? "default" : "outline"}
                        className="text-xs"
                      >
                        {model.is_active ? "active" : "inactive"}
                      </Badge>
                    </button>
                    <Separator />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="p-3">
            <Button
              className="w-full gap-2"
              variant="outline"
              onClick={() => navigate("/admin/models/new")}
            >
              <Plus className="h-4 w-4" />
              Add New Model
            </Button>
          </CardFooter>
        </Card>

        <div className="flex-1">
          {!activeModel ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Brain className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-xl font-medium">No Model Selected</h3>
                  <p className="text-muted-foreground max-w-md">
                    Select a model from the list or add a new one to get
                    started.
                  </p>
                  <Button
                    onClick={() => navigate("/admin/models/new")}
                    className="mt-4 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Model
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="configuration" className="w-full">
              <TabsList className="w-full max-w-md grid grid-cols-3">
                <TabsTrigger
                  value="configuration"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Configuration</span>
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  className="flex items-center gap-2"
                >
                  <BarChart className="h-4 w-4" />
                  <span>Performance</span>
                </TabsTrigger>
                <TabsTrigger value="test" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Test Model</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="configuration" className="pt-6">
                {models
                  .filter((model) => model.id === activeModel)
                  .map((model) => (
                    <Card key={model.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>{model.name}</CardTitle>
                          <CardDescription>
                            {model.type} by{" "}
                            {model.provider?.name || "Unknown Provider"}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(model.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              navigate(`/admin/models/${model.id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="apiEndpoint">API Endpoint</Label>
                            <Input
                              id="apiEndpoint"
                              value={model.api_endpoint || ""}
                              readOnly
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="modelStatus">Status</Label>
                            <div className="flex items-center justify-between">
                              <span>
                                {model.is_active ? "Active" : "Inactive"}
                              </span>
                              <Switch
                                id="modelStatus"
                                checked={model.is_active}
                                onCheckedChange={() =>
                                  handleToggleStatus(model.id, model.is_active)
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Model Parameters
                          </h3>

                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="temperature">Temperature</Label>
                              <div className="flex items-center gap-4">
                                <Slider
                                  id="temperature"
                                  min={0}
                                  max={1}
                                  step={0.1}
                                  defaultValue={[
                                    model.default_parameters?.temperature ||
                                      0.7,
                                  ]}
                                  className="flex-1"
                                />
                                <span className="w-12 text-center">
                                  {model.default_parameters?.temperature?.toFixed(
                                    1,
                                  ) || "0.7"}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Controls randomness: lower values are more
                                deterministic
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="maxTokens">Max Tokens</Label>
                              <Input
                                id="maxTokens"
                                type="number"
                                defaultValue={model.max_tokens || 1024}
                                readOnly
                              />
                              <p className="text-xs text-muted-foreground">
                                Maximum number of tokens to generate
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="topP">Top P</Label>
                              <div className="flex items-center gap-4">
                                <Slider
                                  id="topP"
                                  min={0}
                                  max={1}
                                  step={0.05}
                                  defaultValue={[
                                    model.default_parameters?.top_p || 0.9,
                                  ]}
                                  className="flex-1"
                                />
                                <span className="w-12 text-center">
                                  {model.default_parameters?.top_p?.toFixed(
                                    2,
                                  ) || "0.90"}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Nucleus sampling: only consider tokens with
                                top_p probability mass
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="presencePenalty">
                                Presence Penalty
                              </Label>
                              <div className="flex items-center gap-4">
                                <Slider
                                  id="presencePenalty"
                                  min={-2}
                                  max={2}
                                  step={0.1}
                                  defaultValue={[
                                    model.default_parameters
                                      ?.presence_penalty || 0,
                                  ]}
                                  className="flex-1"
                                />
                                <span className="w-12 text-center">
                                  {model.default_parameters?.presence_penalty?.toFixed(
                                    1,
                                  ) || "0.0"}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Penalizes repeated tokens: higher values
                                increase diversity
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">System Prompt</h3>
                          <div className="space-y-2">
                            <Label htmlFor="systemPrompt">Default Prompt</Label>
                            <Textarea
                              id="systemPrompt"
                              rows={4}
                              defaultValue={
                                model.system_prompt ||
                                "You are a helpful AI assistant for our company. Answer questions accurately and concisely based on the provided context. If you don't know the answer, say so rather than making up information."
                              }
                              readOnly
                            />
                            <p className="text-xs text-muted-foreground">
                              This prompt will be used as the default system
                              instruction for this model
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button
                          className="gap-2"
                          onClick={() => navigate(`/admin/models/${model.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit Configuration
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="performance" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>
                      Analyze how this model is performing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Response Time</div>
                        <div className="text-2xl font-bold">1.2s</div>
                        <div className="text-xs text-muted-foreground">
                          Average over last 7 days
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: "85%" }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Accuracy</div>
                        <div className="text-2xl font-bold">94.2%</div>
                        <div className="text-xs text-muted-foreground">
                          Based on user feedback
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: "94%" }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Usage</div>
                        <div className="text-2xl font-bold">68.5%</div>
                        <div className="text-xs text-muted-foreground">
                          Of total queries
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: "68%" }}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Recent Queries
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Query</TableHead>
                            <TableHead>Response Time</TableHead>
                            <TableHead>Tokens</TableHead>
                            <TableHead>Success</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            {
                              query: "How do I integrate the chat widget?",
                              time: "1.1s",
                              tokens: 156,
                              success: true,
                            },
                            {
                              query: "What AI models do you support?",
                              time: "0.9s",
                              tokens: 128,
                              success: true,
                            },
                            {
                              query:
                                "Can you explain quantum computing in simple terms?",
                              time: "1.8s",
                              tokens: 312,
                              success: true,
                            },
                            {
                              query: "What's the pricing for enterprise plans?",
                              time: "1.2s",
                              tokens: 187,
                              success: false,
                            },
                            {
                              query: "How to customize the widget appearance?",
                              time: "1.0s",
                              tokens: 203,
                              success: true,
                            },
                          ].map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium truncate max-w-[200px]">
                                {item.query}
                              </TableCell>
                              <TableCell>{item.time}</TableCell>
                              <TableCell>{item.tokens}</TableCell>
                              <TableCell>
                                {item.success ? (
                                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="test" className="pt-6">
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
                        className="gap-2"
                        onClick={handleTestModel}
                        disabled={testLoading}
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
                            <p className="whitespace-pre-wrap">
                              {testResponse}
                            </p>
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
            </Tabs>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the AI
              model configuration and remove it from your system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageContainer>
  );
};

export default AIModels;
