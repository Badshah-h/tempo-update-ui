import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Copy, Check, Code, Globe, FileCode, Settings, Palette } from "lucide-react";
import { ChatWidgetConfig } from "@/types/chat";
import { defaultWidgetConfig } from "@/mock/chat/config";

interface EmbedCodeGeneratorProps {
  config?: Partial<ChatWidgetConfig>;
  onConfigChange?: (config: Partial<ChatWidgetConfig>) => void;
  apiKey?: string;
  domain?: string;
}

const EmbedCodeGenerator: React.FC<EmbedCodeGeneratorProps> = ({
  config = {},
  onConfigChange,
  apiKey = "YOUR_API_KEY",
  domain = "https://chat-widget.example.com",
}) => {
  const [activeTab, setActiveTab] = useState("iframe");
  const [copied, setCopied] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState<Partial<ChatWidgetConfig>>({
    ...defaultWidgetConfig,
    ...config,
  });

  // Additional embed options
  const [embedOptions, setEmbedOptions] = useState({
    lazyLoad: true,
    preconnect: true,
    crossOrigin: "anonymous",
    deferScripts: true,
  });

  useEffect(() => {
    setWidgetConfig({ ...defaultWidgetConfig, ...config });
  }, [config]);

  const handleConfigChange = (
    key: keyof ChatWidgetConfig,
    value: any
  ) => {
    const newConfig = { ...widgetConfig, [key]: value };
    setWidgetConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const handleEmbedOptionChange = (
    key: string,
    value: any
  ) => {
    setEmbedOptions({ ...embedOptions, [key]: value });
  };

  const generateIframeCode = () => {
    const params = new URLSearchParams();
    if (widgetConfig.primaryColor) params.append("primaryColor", widgetConfig.primaryColor);
    if (widgetConfig.secondaryColor) params.append("secondaryColor", widgetConfig.secondaryColor);
    if (widgetConfig.title) params.append("title", encodeURIComponent(widgetConfig.title));
    if (widgetConfig.subtitle) params.append("subtitle", encodeURIComponent(widgetConfig.subtitle));
    if (widgetConfig.initiallyOpen) params.append("initiallyOpen", "true");
    if (widgetConfig.position) params.append("position", widgetConfig.position);
    params.append("apiKey", apiKey);

    return `<!-- AI Chat Widget - Iframe Embed -->
<div id="ai-chat-widget-container" style="position: fixed; ${widgetConfig.position?.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'} ${widgetConfig.position?.includes('right') ? 'right: 20px;' : 'left: 20px;'} z-index: 9999;">
  <iframe
    src="${domain}/widget?${params.toString()}"
    width="350"
    height="500"
    frameborder="0"
    style="border: none; background: transparent;"
    title="${widgetConfig.title || 'AI Chat Widget'}"
    loading="${embedOptions.lazyLoad ? 'lazy' : 'eager'}"
    ${embedOptions.crossOrigin ? `crossorigin="${embedOptions.crossOrigin}"` : ''}
  ></iframe>
</div>`;
  };

  const generateWebComponentCode = () => {
    return `<!-- AI Chat Widget - Web Component Embed -->
<script ${embedOptions.deferScripts ? 'defer' : ''} src="${domain}/widget-component.js"></script>
<ai-chat-widget
  widget-id="default"
  primary-color="${widgetConfig.primaryColor}"
  secondary-color="${widgetConfig.secondaryColor}"
  position="${widgetConfig.position}"
  initially-open="${widgetConfig.initiallyOpen ? 'true' : 'false'}"
  api-key="${apiKey}"
></ai-chat-widget>`;
  };

  const generateScriptCode = () => {
    return `<!-- AI Chat Widget - Script Embed -->
<script ${embedOptions.deferScripts ? 'defer' : ''} src="${domain}/widget-loader.js"
  data-chat-widget="true"
  data-type="${activeTab === 'iframe' ? 'iframe' : 'web-component'}"
  data-widget-id="default"
  data-position="${widgetConfig.position}"
  data-initially-open="${widgetConfig.initiallyOpen ? 'true' : 'false'}"
  data-primary-color="${widgetConfig.primaryColor}"
  data-secondary-color="${widgetConfig.secondaryColor}"
  data-title="${widgetConfig.title}"
  data-subtitle="${widgetConfig.subtitle}"
  data-api-key="${apiKey}"
  data-lazy-load="${embedOptions.lazyLoad ? 'true' : 'false'}"
  data-preconnect="${embedOptions.preconnect ? 'true' : 'false'}"
></script>`;
  };

  const getEmbedCode = () => {
    switch (activeTab) {
      case "iframe":
        return generateIframeCode();
      case "web-component":
        return generateWebComponentCode();
      case "script":
        return generateScriptCode();
      default:
        return generateIframeCode();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background border shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Embed Chat Widget</h2>

        <Tabs defaultValue="iframe" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="iframe" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              iFrame
            </TabsTrigger>
            <TabsTrigger value="web-component" className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              Web Component
            </TabsTrigger>
            <TabsTrigger value="script" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Script
            </TabsTrigger>
          </TabsList>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Widget Appearance
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: widgetConfig.primaryColor }}
                        />
                        <Input
                          id="primaryColor"
                          type="text"
                          value={widgetConfig.primaryColor}
                          onChange={(e) =>
                            handleConfigChange("primaryColor", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: widgetConfig.secondaryColor }}
                        />
                        <Input
                          id="secondaryColor"
                          type="text"
                          value={widgetConfig.secondaryColor}
                          onChange={(e) =>
                            handleConfigChange("secondaryColor", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Widget Title</Label>
                    <Input
                      id="title"
                      value={widgetConfig.title}
                      onChange={(e) => handleConfigChange("title", e.target.value)}
                      placeholder="AI Assistant"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Widget Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={widgetConfig.subtitle}
                      onChange={(e) =>
                        handleConfigChange("subtitle", e.target.value)
                      }
                      placeholder="Ask me anything!"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Widget Position</Label>
                    <Select
                      value={widgetConfig.position}
                      onValueChange={(value) =>
                        handleConfigChange(
                          "position",
                          value as "bottom-right" | "bottom-left" | "top-right" | "top-left"
                        )
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
                    <Label htmlFor="initiallyOpen">Initially Open</Label>
                    <Switch
                      id="initiallyOpen"
                      checked={widgetConfig.initiallyOpen}
                      onCheckedChange={(checked) =>
                        handleConfigChange("initiallyOpen", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Embed Options
                </h3>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Widget Domain</Label>
                    <Input
                      id="domain"
                      value={domain}
                      disabled
                      placeholder="https://chat-widget.example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      value={apiKey}
                      disabled
                      type="password"
                      placeholder="YOUR_API_KEY"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setAdvancedOptions(!advancedOptions)}
                      className="w-full"
                    >
                      {advancedOptions ? "Hide" : "Show"} Advanced Options
                    </Button>
                  </div>

                  {advancedOptions && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="lazyLoad">Lazy Load</Label>
                        <Switch
                          id="lazyLoad"
                          checked={embedOptions.lazyLoad}
                          onCheckedChange={(checked) =>
                            handleEmbedOptionChange("lazyLoad", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="preconnect">Preconnect</Label>
                        <Switch
                          id="preconnect"
                          checked={embedOptions.preconnect}
                          onCheckedChange={(checked) =>
                            handleEmbedOptionChange("preconnect", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="deferScripts">Defer Scripts</Label>
                        <Switch
                          id="deferScripts"
                          checked={embedOptions.deferScripts}
                          onCheckedChange={(checked) =>
                            handleEmbedOptionChange("deferScripts", checked)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="crossOrigin">Cross Origin</Label>
                        <Select
                          value={embedOptions.crossOrigin}
                          onValueChange={(value) =>
                            handleEmbedOptionChange("crossOrigin", value)
                          }
                        >
                          <SelectTrigger id="crossOrigin">
                            <SelectValue placeholder="Select cross origin policy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="anonymous">Anonymous</SelectItem>
                            <SelectItem value="use-credentials">
                              Use Credentials
                            </SelectItem>
                            <SelectItem value="">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="embedCode">Embed Code</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="embedCode"
                value={getEmbedCode()}
                readOnly
                className="font-mono text-sm h-40"
              />
            </div>
          </div>
        </Tabs>
      </div>
    </Card>
  );
};

export default EmbedCodeGenerator;
