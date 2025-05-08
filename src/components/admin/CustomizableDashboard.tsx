import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Save, RotateCcw, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DraggableWidget from "./DraggableWidget";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface Widget {
  id: string;
  type: string;
  title: string;
  size: "small" | "medium" | "large";
  position: { x: number; y: number };
  gridArea?: string;
}

interface CustomizableDashboardProps {
  defaultWidgets?: Widget[];
  renderWidget: (type: string, id: string) => React.ReactNode;
  availableWidgets: { type: string; title: string }[];
  onSaveLayout?: (widgets: Widget[]) => void;
}

const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
  defaultWidgets = [],
  renderWidget,
  availableWidgets,
  onSaveLayout,
}) => {
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [activeTab, setActiveTab] = useState("grid");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load saved layout from localStorage
    const savedLayout = localStorage.getItem("dashboardLayout");
    if (savedLayout) {
      try {
        setWidgets(JSON.parse(savedLayout));
      } catch (e) {
        console.error("Failed to parse saved layout", e);
      }
    }
  }, []);

  const handleAddWidget = (type: string, title: string) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title,
      size: "medium",
      position: { x: 0, y: 0 },
    };

    setWidgets([...widgets, newWidget]);
    toast({
      title: "Widget Added",
      description: `${title} has been added to your dashboard.`,
    });
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id));
  };

  const handlePositionChange = (
    id: string,
    position: { x: number; y: number },
  ) => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === id ? { ...widget, position } : widget,
      ),
    );
  };

  const handleSizeChange = (id: string, size: "small" | "medium" | "large") => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === id ? { ...widget, size } : widget,
      ),
    );
  };

  const saveLayout = () => {
    localStorage.setItem("dashboardLayout", JSON.stringify(widgets));
    if (onSaveLayout) {
      onSaveLayout(widgets);
    }
    setIsEditing(false);
    toast({
      title: "Layout Saved",
      description: "Your dashboard layout has been saved.",
    });
  };

  const resetLayout = () => {
    setWidgets(defaultWidgets);
    localStorage.removeItem("dashboardLayout");
    toast({
      title: "Layout Reset",
      description: "Your dashboard has been reset to default.",
    });
  };

  return (
    <div className="space-y-4 w-full">
      {/* Top bar: Tabs on the left, buttons on the right */}
      <div className="flex flex-row items-center justify-between w-full gap-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid max-w-md grid-cols-2">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              <span>Grid Layout</span>
            </TabsTrigger>
            <TabsTrigger value="free" className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: isEditing ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Plus className="h-4 w-4" />
              </motion.div>
              <span>Free Layout</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-row items-center gap-2 md:ml-6">
          {/* Place Hide Effects button here if needed */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 min-w-[110px]"
              >
                <Plus className="h-4 w-4" />
                Add Widget
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {availableWidgets.map((widget) => (
                <DropdownMenuItem
                  key={widget.type}
                  onClick={() => handleAddWidget(widget.type, widget.title)}
                  className="cursor-pointer"
                >
                  {widget.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 min-w-[80px]"
            onClick={resetLayout}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>

          <Button
            variant="default"
            size="sm"
            className="gap-2 min-w-[110px]"
            onClick={saveLayout}
          >
            <Save className="h-4 w-4" />
            Save Layout
          </Button>
        </div>
      </div>

      <Separator />

      {/* Tab content below the top bar */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="grid" className="mt-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {widgets.map((widget) => (
              <DraggableWidget
                key={widget.id}
                id={widget.id}
                title={widget.title}
                initialSize={widget.size}
                onRemove={() => handleRemoveWidget(widget.id)}
                onSizeChange={handleSizeChange}
                className={`${widget.size === "large" ? "col-span-2 row-span-2" : ""}`}
                isDraggable={false}
              >
                {renderWidget(widget.type, widget.id)}
              </DraggableWidget>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="free" className="mt-4 w-full">
          <div className="relative h-[800px] bg-muted/20 rounded-lg border border-dashed border-muted p-4 overflow-hidden w-full">
            {widgets.map((widget) => (
              <motion.div
                key={widget.id}
                initial={{ x: widget.position.x, y: widget.position.y }}
                className="absolute"
                style={{
                  width:
                    widget.size === "small"
                      ? "300px"
                      : widget.size === "medium"
                        ? "400px"
                        : "500px",
                }}
              >
                <DraggableWidget
                  id={widget.id}
                  title={widget.title}
                  initialSize={widget.size}
                  initialPosition={widget.position}
                  onRemove={() => handleRemoveWidget(widget.id)}
                  onPositionChange={handlePositionChange}
                  onSizeChange={handleSizeChange}
                  isDraggable={true}
                >
                  {renderWidget(widget.type, widget.id)}
                </DraggableWidget>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomizableDashboard;
