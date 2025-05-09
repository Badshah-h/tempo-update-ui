import React, { useState } from "react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
} from "lucide-react";

const AIModels = () => {
  const navigate = useNavigate();
  const [activeModel, setActiveModel] = useState("gemini-pro");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [modelToDelete, setModelToDelete] = useState(null);

  const models = [
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      provider: "Google",
      type: "Large Language Model",
      status: "active",
      performance: 94,
      costPerQuery: "$0.0010",
      apiKey: "AIza...",
    },
    {
      id: "huggingface-t5",
      name: "T5 Large",
      provider: "Hugging Face",
      type: "Text-to-Text",
      status: "active",
      performance: 89,
      costPerQuery: "$0.0005",
      apiKey: "hf_...",
    },
    {
      id: "custom-finetune",
      name: "Custom Fine-tuned",
      provider: "OpenAI",
      type: "Fine-tuned GPT",
      status: "inactive",
      performance: 96,
      costPerQuery: "$0.0020",
      apiKey: "sk-...",
    },
  ];

  const handleDeleteClick = (modelId) => {
    setModelToDelete(modelId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, this would delete the model
    console.log(`Deleting model: ${modelToDelete}`);
    setShowDeleteDialog(false);
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
          <CardHeader>
            <CardTitle className="text-lg">Models</CardTitle>
            <CardDescription>Available AI models</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
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
                          {model.provider}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        model.status === "active" ? "default" : "outline"
                      }
                      className="text-xs"
                    >
                      {model.status}
                    </Badge>
                  </button>
                  <Separator />
                </motion.div>
              ))}
            </motion.div>
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
                          {model.type} by {model.provider}
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
                          onClick={() => navigate(`/admin/models/${model.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="apiKey">API Key</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            value={model.apiKey}
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="modelStatus">Status</Label>
                          <div className="flex items-center justify-between">
                            <span>
                              {model.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                            <Switch
                              id="modelStatus"
                              checked={model.status === "active"}
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
                                defaultValue={[0.7]}
                                className="flex-1"
                              />
                              <span className="w-12 text-center">0.7</span>
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
                              defaultValue={1024}
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
                                defaultValue={[0.9]}
                                className="flex-1"
                              />
                              <span className="w-12 text-center">0.9</span>
                            </div>
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
                                defaultValue={[0]}
                                className="flex-1"
                              />
                              <span className="w-12 text-center">0.0</span>
                            </div>
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
                            defaultValue="You are a helpful AI assistant for our company. Answer questions accurately and concisely based on the provided context. If you don't know the answer, say so rather than making up information."
                          />
                          <p className="text-xs text-muted-foreground">
                            This prompt will be used as the default system
                            instruction for this model
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
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
                    <h3 className="text-lg font-medium mb-4">Recent Queries</h3>
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
                      defaultValue="What are the key features of your AI chat system?"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <Zap className="h-4 w-4" />
                      Run Test
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Response</Label>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="whitespace-pre-wrap">
                        Our AI chat system offers several key features:
                        <br />
                        <br />
                        1. Context-aware AI responses that understand user
                        queries
                        <br />
                        2. Multiple integration options (iFrame and Web
                        Component)
                        <br />
                        3. Real-time communication via WebSockets
                        <br />
                        4. Comprehensive admin dashboard for configuration
                        <br />
                        5. Support for multiple AI models (Gemini and Hugging
                        Face)
                        <br />
                        6. Customizable appearance to match your brand
                        <br />
                        7. Analytics and performance monitoring
                        <br />
                        <br />
                        Would you like more information about any specific
                        feature?
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Response Time</div>
                      <div className="text-xl font-bold">1.3s</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Tokens Used</div>
                      <div className="text-xl font-bold">217</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Estimated Cost</div>
                      <div className="text-xl font-bold">$0.00043</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageContainer>
  );
};

export default AIModels;
