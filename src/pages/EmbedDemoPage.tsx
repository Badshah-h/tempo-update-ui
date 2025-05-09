import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clipboard, Code, ExternalLink, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const EmbedDemoPage: React.FC = () => {
  const { toast } = useToast();
  const [widgetId, setWidgetId] = useState("demo-widget");
  const [theme, setTheme] = useState("system");
  const [position, setPosition] = useState("bottom-right");
  const [autoOpen, setAutoOpen] = useState(false);
  const [hideOnMobile, setHideOnMobile] = useState(false);
  const [embedType, setEmbedType] = useState("iframe");
  const [scriptCode, setScriptCode] = useState("");
  const [initCode, setInitCode] = useState("");

  // Generate the embed code when configuration changes
  useEffect(() => {
    const script = `<script src="${window.location.origin}/embed/widget-loader.js"></script>`;
    
    let init = `<script>\n  document.addEventListener("DOMContentLoaded", function() {\n    aiChatWidget.init({\n`;
    init += `      widgetId: "${widgetId}",\n`;
    init += `      theme: "${theme}",\n`;
    init += `      position: "${position}",\n`;
    
    if (autoOpen) {
      init += `      autoOpen: true,\n`;
    }
    
    if (hideOnMobile) {
      init += `      hideOnMobile: true,\n`;
    }
    
    if (embedType !== "iframe") {
      init += `      embedType: "${embedType}",\n`;
    }
    
    init += `    });\n  });\n</script>`;
    
    setScriptCode(script);
    setInitCode(init);
  }, [widgetId, theme, position, autoOpen, hideOnMobile, embedType]);

  // Copy code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The code has been copied to your clipboard.",
      });
    });
  };

  // Load the widget with current settings
  const loadWidget = () => {
    // First, remove any existing widget
    const existingScript = document.getElementById("widget-loader-script");
    if (existingScript) {
      existingScript.remove();
    }
    
    // Create and load the script
    const script = document.createElement("script");
    script.id = "widget-loader-script";
    script.src = `${window.location.origin}/embed/widget-loader.js`;
    script.onload = () => {
      // Initialize the widget
      (window as any).aiChatWidget.init({
        widgetId,
        theme,
        position,
        autoOpen,
        hideOnMobile,
        embedType,
      });
    };
    
    document.body.appendChild(script);
    
    toast({
      title: "Widget loaded",
      description: "The chat widget has been loaded with your settings.",
    });
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">AI Chat Widget Embed Demo</h1>
      <p className="text-muted-foreground mb-8">
        Configure and test the AI Chat Widget embedding options. Generate code to embed the widget on your website.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Widget Configuration</CardTitle>
            <CardDescription>
              Customize how the widget appears and behaves
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="widget-id">Widget ID</Label>
              <Input
                id="widget-id"
                value={widgetId}
                onChange={(e) => setWidgetId(e.target.value)}
                placeholder="Enter widget ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select value={position} onValueChange={setPosition}>
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
            
            <div className="space-y-2">
              <Label htmlFor="embed-type">Embed Type</Label>
              <Select value={embedType} onValueChange={setEmbedType}>
                <SelectTrigger id="embed-type">
                  <SelectValue placeholder="Select embed type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iframe">iFrame</SelectItem>
                  <SelectItem value="web-component">Web Component</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-open" className="cursor-pointer">Auto Open</Label>
              <Switch
                id="auto-open"
                checked={autoOpen}
                onCheckedChange={setAutoOpen}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="hide-mobile" className="cursor-pointer">Hide on Mobile</Label>
              <Switch
                id="hide-mobile"
                checked={hideOnMobile}
                onCheckedChange={setHideOnMobile}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={loadWidget} className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Load Widget
            </Button>
          </CardFooter>
        </Card>
        
        {/* Code Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Embed Code</CardTitle>
            <CardDescription>
              Copy this code to embed the widget on your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="code">
              <TabsList className="mb-4">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="space-y-4">
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    <code>{scriptCode}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(scriptCode)}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    <code>{initCode}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(initCode)}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Add this code to your website's HTML
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`${scriptCode}\n${initCode}`)}
                  >
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy All
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="preview">
                <div className="border rounded-md p-6 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Widget Preview</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click the button below to load the widget with your settings
                    </p>
                    <Button onClick={loadWidget}>
                      <Play className="mr-2 h-4 w-4" />
                      Load Widget
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <a href="/embed/documentation" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Documentation
              </a>
            </Button>
            <Button onClick={loadWidget}>
              <Play className="mr-2 h-4 w-4" />
              Test Widget
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmbedDemoPage;
