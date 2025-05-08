import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, Palette, Type, Layout, Save } from "lucide-react";
import ChatWidget from "../chat/ChatWidget";

const WidgetConfig = () => {
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState({
    title: "AI Assistant",
    subtitle: "Ask me anything!",
    primaryColor: "#4f46e5",
    secondaryColor: "#f3f4f6",
    position: "bottom-right",
    initiallyOpen: false,
    welcomeMessage: "Hello! How can I help you today?",
    fontFamily: "Inter",
    borderRadius: 8,
    spacing: "comfortable",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
    suggestedQuestions: [
      "How can I integrate this chat widget?",
      "What AI models do you support?",
      "Can I customize the appearance?",
    ],
  });

  const handleChange = (field, value) => {
    setConfig({
      ...config,
      [field]: value,
    });
  };

  const copyEmbedCode = () => {
    const code = `<script src="https://chat.example.com/widget.js" id="ai-chat-widget" data-widget-id="default-widget-id" data-position="${config.position}" data-color="${config.primaryColor}" data-title="${config.title}"></script>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div className="container py-6 space-y-8 max-w-7xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Widget Configuration</h1>
        <p className="text-muted-foreground">
          Customize how your AI chat widget looks and behaves.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="behavior" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <span>Behavior</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="pt-6">
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Colors & Branding</CardTitle>
                      <CardDescription>
                        Customize the colors to match your brand identity
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="primaryColor">Primary Color</Label>
                          <div className="flex gap-2">
                            <div
                              className="h-10 w-10 rounded-md border"
                              style={{ backgroundColor: config.primaryColor }}
                            />
                            <Input
                              id="primaryColor"
                              type="text"
                              value={config.primaryColor}
                              onChange={(e) =>
                                handleChange("primaryColor", e.target.value)
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secondaryColor">Secondary Color</Label>
                          <div className="flex gap-2">
                            <div
                              className="h-10 w-10 rounded-md border"
                              style={{ backgroundColor: config.secondaryColor }}
                            />
                            <Input
                              id="secondaryColor"
                              type="text"
                              value={config.secondaryColor}
                              onChange={(e) =>
                                handleChange("secondaryColor", e.target.value)
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fontFamily">Font Family</Label>
                        <Select
                          value={config.fontFamily}
                          onValueChange={(value) =>
                            handleChange("fontFamily", value)
                          }
                        >
                          <SelectTrigger id="fontFamily">
                            <SelectValue placeholder="Select font family" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="SF Pro">SF Pro</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="System UI">System UI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="borderRadius">Border Radius</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="borderRadius"
                            min={0}
                            max={20}
                            step={1}
                            value={[config.borderRadius]}
                            onValueChange={(value) =>
                              handleChange("borderRadius", value[0])
                            }
                            className="flex-1"
                          />
                          <span className="w-12 text-center">
                            {config.borderRadius}px
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="spacing">Spacing Density</Label>
                        <RadioGroup
                          id="spacing"
                          value={config.spacing}
                          onValueChange={(value) =>
                            handleChange("spacing", value)
                          }
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="compact" id="compact" />
                            <Label htmlFor="compact">Compact</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="comfortable"
                              id="comfortable"
                            />
                            <Label htmlFor="comfortable">Comfortable</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="spacious" id="spacious" />
                            <Label htmlFor="spacious">Spacious</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="avatarUrl">Avatar URL</Label>
                        <div className="flex gap-4">
                          <div className="h-10 w-10 rounded-full overflow-hidden border">
                            <img
                              src={config.avatarUrl}
                              alt="Avatar"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <Input
                            id="avatarUrl"
                            type="text"
                            value={config.avatarUrl}
                            onChange={(e) =>
                              handleChange("avatarUrl", e.target.value)
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="content" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Text & Messages</CardTitle>
                  <CardDescription>
                    Customize the text content of your chat widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Widget Title</Label>
                      <Input
                        id="title"
                        value={config.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Widget Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={config.subtitle}
                        onChange={(e) =>
                          handleChange("subtitle", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Textarea
                      id="welcomeMessage"
                      value={config.welcomeMessage}
                      onChange={(e) =>
                        handleChange("welcomeMessage", e.target.value)
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Suggested Questions</Label>
                    <div className="space-y-3">
                      {config.suggestedQuestions.map((question, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={question}
                            onChange={(e) => {
                              const newQuestions = [
                                ...config.suggestedQuestions,
                              ];
                              newQuestions[index] = e.target.value;
                              handleChange("suggestedQuestions", newQuestions);
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newQuestions = [
                                ...config.suggestedQuestions,
                              ];
                              newQuestions.splice(index, 1);
                              handleChange("suggestedQuestions", newQuestions);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleChange("suggestedQuestions", [
                            ...config.suggestedQuestions,
                            "New suggested question",
                          ]);
                        }}
                      >
                        Add Question
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Widget Behavior</CardTitle>
                  <CardDescription>
                    Configure how the chat widget behaves on your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="position">Widget Position</Label>
                    <Select
                      value={config.position}
                      onValueChange={(value) =>
                        handleChange("position", value)
                      }
                    >
                      <SelectTrigger id="position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="initiallyOpen">Initially Open</Label>
                      <p className="text-sm text-muted-foreground">
                        Open the chat widget automatically when the page loads
                      </p>
                    </div>
                    <Switch
                      id="initiallyOpen"
                      checked={config.initiallyOpen}
                      onCheckedChange={(checked) =>
                        handleChange("initiallyOpen", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Advanced Options</h4>
                      <p className="text-sm text-muted-foreground">
                        Additional configuration options for the chat widget
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoFocus">Auto Focus Input</Label>
                        <Switch id="autoFocus" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="persistHistory">Persist Chat History</Label>
                        <Switch id="persistHistory" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="soundEffects">Sound Effects</Label>
                        <Switch id="soundEffects" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="hideOnMobile">Hide on Mobile</Label>
                        <Switch id="hideOnMobile" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <CardDescription>
                Add this code to your website to embed the chat widget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>
                    {`<script src="https://chat.example.com/widget.js" id="ai-chat-widget" data-widget-id="default-widget-id" data-position="${config.position}" data-color="${config.primaryColor}" data-title="${config.title}"></script>`}
                  </code>
                </pre>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={copyEmbedCode}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  See how your chat widget will look
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-6 bg-muted/30 rounded-md min-h-[500px] relative">
                <ChatWidget
                  title={config.title}
                  subtitle={config.subtitle}
                  primaryColor={config.primaryColor}
                  secondaryColor={config.secondaryColor}
                  position="bottom-right"
                  initiallyOpen={true}
                  avatarUrl={config.avatarUrl}
                  welcomeMessage={config.welcomeMessage}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetConfig;
