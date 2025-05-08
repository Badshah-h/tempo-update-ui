import React, { useState, useEffect } from "react";
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
import {
  Clipboard,
  Code,
  Copy,
  ExternalLink,
  Globe,
  Monitor,
  Check,
  AlertCircle,
  Save,
  RefreshCw,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface EmbedCodeGeneratorProps {
  widgetId?: string;
  defaultTheme?: "light" | "dark" | "system";
  defaultPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  apiKey?: string;
}

const EmbedCodeGenerator = ({
  widgetId = "default-widget-id",
  defaultTheme = "system",
  defaultPosition = "bottom-right",
  apiKey = "",
}: EmbedCodeGeneratorProps) => {
  const { toast } = useToast();
  const [embedType, setEmbedType] = useState<
    "iframe" | "web-component" | "script"
  >("iframe");
  const [theme, setTheme] = useState<string>(defaultTheme);
  const [position, setPosition] = useState<string>(defaultPosition);
  const [autoOpen, setAutoOpen] = useState<boolean>(false);
  const [hideOnMobile, setHideOnMobile] = useState<boolean>(false);
  const [customDomain, setCustomDomain] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [customWidth, setCustomWidth] = useState<string>("350");
  const [customHeight, setCustomHeight] = useState<string>("500");
  const [activeTab, setActiveTab] = useState<string>("options");
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  // Load saved configuration from localStorage if available
  useEffect(() => {
    const savedConfig = localStorage.getItem(`embed-config-${widgetId}`);
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setEmbedType(config.embedType || "iframe");
        setTheme(config.theme || defaultTheme);
        setPosition(config.position || defaultPosition);
        setAutoOpen(config.autoOpen || false);
        setHideOnMobile(config.hideOnMobile || false);
        setCustomDomain(config.customDomain || "");
        setShowAdvanced(config.showAdvanced || false);
        setCustomWidth(config.customWidth || "350");
        setCustomHeight(config.customHeight || "500");
      } catch (e) {
        console.error("Error loading saved configuration", e);
      }
    }
  }, [widgetId, defaultTheme, defaultPosition]);

  // Save configuration to localStorage
  const saveConfiguration = () => {
    const config = {
      embedType,
      theme,
      position,
      autoOpen,
      hideOnMobile,
      customDomain,
      showAdvanced,
      customWidth,
      customHeight,
    };
    localStorage.setItem(`embed-config-${widgetId}`, JSON.stringify(config));
    toast({
      title: "Configuration Saved",
      description: "Your embed settings have been saved for future use.",
      variant: "default",
    });
  };

  // Base URL for the embed
  const baseUrl = customDomain || "https://chat.example.com";

  const generateIframeCode = () => {
    return `<!-- AI Chat Widget (iframe) -->
<iframe 
  src="${baseUrl}/embed/${widgetId}?theme=${theme}&position=${position}${autoOpen ? "&autoOpen=true" : ""}${hideOnMobile ? "&hideOnMobile=true" : ""}${showAdvanced ? `&width=${customWidth}&height=${customHeight}` : ""}" 
  style="position: fixed; ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"} ${position.includes("right") ? "right: 20px;" : "left: 20px;"} border: none; width: 60px; height: 60px; z-index: 999; overflow: hidden;" 
  id="ai-chat-widget"
  allow="microphone; camera"
  title="AI Chat Assistant">
</iframe>`;
  };

  const generateWebComponentCode = () => {
    return `<!-- AI Chat Widget (Web Component) -->
<script type="module" src="${baseUrl}/embed/widget.js"></script>
<ai-chat-widget 
  widget-id="${widgetId}" 
  theme="${theme}" 
  position="${position}"
  ${autoOpen ? "auto-open" : ""}
  ${hideOnMobile ? "hide-on-mobile" : ""}
  ${showAdvanced ? `width="${customWidth}" height="${customHeight}"` : ""}
  api-key="${apiKey}">
</ai-chat-widget>`;
  };

  const generateScriptCode = () => {
    return `<!-- AI Chat Widget (Script) -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['AI-Chat-Widget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','aiChat','${baseUrl}/embed/widget-loader.js'));
  
  aiChat('init', {
    widgetId: '${widgetId}',
    theme: '${theme}',
    position: '${position}',
    autoOpen: ${autoOpen},
    hideOnMobile: ${hideOnMobile},
    ${
      showAdvanced
        ? `width: ${customWidth},
    height: ${customHeight},`
        : ""
    }
    apiKey: '${apiKey}'
  });
</script>`;
  };

  const getCode = () => {
    switch (embedType) {
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
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Code Copied",
      description: "Embed code has been copied to clipboard.",
      variant: "default",
    });
  };

  const previewUrl = `${baseUrl}/preview/${widgetId}?theme=${theme}&position=${position}${autoOpen ? "&autoOpen=true" : ""}${hideOnMobile ? "&hideOnMobile=true" : ""}${showAdvanced ? `&width=${customWidth}&height=${customHeight}` : ""}`;

  const handlePreviewRefresh = () => {
    setPreviewLoading(true);
    // Simulate loading for better UX
    setTimeout(() => setPreviewLoading(false), 800);
  };

  return (
    <Card className="w-full max-w-4xl bg-background border shadow-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Embed Code Generator
        </CardTitle>
        <CardDescription>
          Generate code to embed the AI chat widget on your website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="options"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="options" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="embed-type">Embed Type</Label>
                <Select
                  value={embedType}
                  onValueChange={(value) =>
                    setEmbedType(value as "iframe" | "web-component" | "script")
                  }
                >
                  <SelectTrigger id="embed-type" className="w-full">
                    <SelectValue placeholder="Select embed type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iframe">iFrame (Isolated)</SelectItem>
                    <SelectItem value="web-component">
                      Web Component (Shadow DOM)
                    </SelectItem>
                    <SelectItem value="script">
                      JavaScript Snippet (Lightweight)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {embedType === "iframe"
                    ? "iFrame provides complete isolation from your website styles."
                    : embedType === "web-component"
                      ? "Web Component uses Shadow DOM for style encapsulation with better integration."
                      : "JavaScript snippet is the lightest option with minimal impact on page load."}
                </p>
              </div>

              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme" className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System (Auto)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="position">Widget Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger id="position" className="w-full">
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
                  <Label htmlFor="auto-open">Auto Open</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically open the chat widget on page load
                  </p>
                </div>
                <Switch
                  id="auto-open"
                  checked={autoOpen}
                  onCheckedChange={setAutoOpen}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hide-mobile">Hide on Mobile</Label>
                  <p className="text-xs text-muted-foreground">
                    Don't show the widget on mobile devices
                  </p>
                </div>
                <Switch
                  id="hide-mobile"
                  checked={hideOnMobile}
                  onCheckedChange={setHideOnMobile}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="advanced-options">Advanced Options</Label>
                  <p className="text-xs text-muted-foreground">
                    Configure additional widget settings
                  </p>
                </div>
                <Switch
                  id="advanced-options"
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                />
              </div>

              {showAdvanced && (
                <div className="space-y-4 pt-2 border-t">
                  <div>
                    <Label htmlFor="custom-domain">
                      Custom Domain (Optional)
                    </Label>
                    <Input
                      id="custom-domain"
                      placeholder="https://chat.yourdomain.com"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      If you have a custom domain for the chat widget, enter it
                      here
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="custom-width">Widget Width (px)</Label>
                      <Input
                        id="custom-width"
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-height">Widget Height (px)</Label>
                      <Input
                        id="custom-height"
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {apiKey ? (
                    <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                      <Check className="h-4 w-4" />
                      <AlertTitle>API Key Configured</AlertTitle>
                      <AlertDescription>
                        Your API key is set and will be included in the embed
                        code.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>API Key Required</AlertTitle>
                      <AlertDescription>
                        Configure an API key in your admin settings to enable
                        the widget.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={saveConfiguration}
                >
                  <Save className="h-4 w-4" />
                  Save Configuration
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="pt-4">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm backdrop-blur-sm">
                <code className="text-xs sm:text-sm whitespace-pre-wrap break-all">
                  {getCode()}
                </code>
              </pre>
              <div className="absolute inset-0 bg-gradient-shimmer animate-shimmer opacity-10 pointer-events-none"></div>
              <TooltipProvider>
                <Tooltip open={copied}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Copied!" : "Copy code"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Add this code to your website's HTML where you want the chat
                widget to appear.
              </p>
              {embedType === "script" && (
                <p className="mt-2">
                  For best performance, place the script just before the closing
                  <code className="bg-muted px-1 rounded">
                    {"</body>"}
                  </code>{" "}
                  tag.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="pt-4">
            <div className="border rounded-md p-4 flex flex-col items-center justify-center min-h-[300px] bg-muted/50">
              <div className="flex flex-col items-center gap-4">
                {previewLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="h-16 w-16 text-muted-foreground animate-spin" />
                    <p className="text-center text-muted-foreground">
                      Loading preview...
                    </p>
                  </div>
                ) : (
                  <>
                    <Monitor className="h-16 w-16 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      Preview how your widget will look with current settings
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={handlePreviewRefresh}
                      >
                        <RefreshCw className="h-4 w-4" />
                        Refresh Preview
                      </Button>
                      <Button variant="outline" className="gap-2" asChild>
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="h-4 w-4" />
                          Open Preview
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 border rounded-md bg-muted/20">
              <h3 className="text-sm font-medium mb-2">Preview Information</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium">Embed Type:</span> {embedType}
                </div>
                <div>
                  <span className="font-medium">Theme:</span> {theme}
                </div>
                <div>
                  <span className="font-medium">Position:</span> {position}
                </div>
                <div>
                  <span className="font-medium">Auto Open:</span>{" "}
                  {autoOpen ? "Yes" : "No"}
                </div>
                {showAdvanced && (
                  <>
                    <div>
                      <span className="font-medium">Width:</span> {customWidth}
                      px
                    </div>
                    <div>
                      <span className="font-medium">Height:</span>{" "}
                      {customHeight}px
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">Widget ID: {widgetId}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab("options")}
            className="hidden sm:flex"
          >
            Edit Options
          </Button>
          <Button onClick={copyToClipboard} className="gap-2">
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy Embed Code"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmbedCodeGenerator;
