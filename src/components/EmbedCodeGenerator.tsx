import React, { useState } from "react";
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
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmbedCodeGeneratorProps {
  widgetId?: string;
  defaultTheme?: "light" | "dark" | "system";
  defaultPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

const EmbedCodeGenerator = ({
  widgetId = "default-widget-id",
  defaultTheme = "system",
  defaultPosition = "bottom-right",
}: EmbedCodeGeneratorProps) => {
  const [embedType, setEmbedType] = useState<"iframe" | "web-component">(
    "iframe",
  );
  const [theme, setTheme] = useState<string>(defaultTheme);
  const [position, setPosition] = useState<string>(defaultPosition);
  const [autoOpen, setAutoOpen] = useState<boolean>(false);
  const [hideOnMobile, setHideOnMobile] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const generateIframeCode = () => {
    return `<!-- AI Chat Widget (iframe) -->
<iframe 
  src="https://chat.example.com/embed/${widgetId}?theme=${theme}&position=${position}${autoOpen ? "&autoOpen=true" : ""}${hideOnMobile ? "&hideOnMobile=true" : ""}" 
  style="position: fixed; ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"} ${position.includes("right") ? "right: 20px;" : "left: 20px;"} border: none; width: 60px; height: 60px; z-index: 999; overflow: hidden;" 
  id="ai-chat-widget"
  allow="microphone; camera"
  title="AI Chat Assistant">
</iframe>`;
  };

  const generateWebComponentCode = () => {
    return `<!-- AI Chat Widget (Web Component) -->
<script type="module" src="https://chat.example.com/embed/widget.js"></script>
<ai-chat-widget 
  widget-id="${widgetId}" 
  theme="${theme}" 
  position="${position}"
  ${autoOpen ? "auto-open" : ""}
  ${hideOnMobile ? "hide-on-mobile" : ""}>
</ai-chat-widget>`;
  };

  const getCode = () => {
    return embedType === "iframe"
      ? generateIframeCode()
      : generateWebComponentCode();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewUrl = `https://chat.example.com/preview/${widgetId}?theme=${theme}&position=${position}${autoOpen ? "&autoOpen=true" : ""}${hideOnMobile ? "&hideOnMobile=true" : ""}`;

  return (
    <Card className="w-full max-w-4xl bg-background border shadow-md">
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
        <Tabs defaultValue="options" className="w-full">
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
                    setEmbedType(value as "iframe" | "web-component")
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
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {embedType === "iframe"
                    ? "iFrame provides complete isolation from your website styles."
                    : "Web Component uses Shadow DOM for style encapsulation with better integration."}
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
            </div>
          </TabsContent>

          <TabsContent value="code" className="pt-4">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code className="text-xs sm:text-sm whitespace-pre-wrap break-all">
                  {getCode()}
                </code>
              </pre>
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
                        <Clipboard className="h-4 w-4" />
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
            </div>
          </TabsContent>

          <TabsContent value="preview" className="pt-4">
            <div className="border rounded-md p-4 flex flex-col items-center justify-center min-h-[300px] bg-muted/50">
              <div className="flex flex-col items-center gap-4">
                <Monitor className="h-16 w-16 text-muted-foreground" />
                <p className="text-center text-muted-foreground">
                  Preview how your widget will look with current settings
                </p>
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
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">Widget ID: {widgetId}</p>
        <Button onClick={copyToClipboard}>
          {copied ? "Copied!" : "Copy Embed Code"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmbedCodeGenerator;
