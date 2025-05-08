import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DraggableWidgetProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onRemove?: () => void;
  id: string;
  size?: "small" | "medium" | "large";
  position?: { x: number; y: number };
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  onSizeChange?: (id: string, size: "small" | "medium" | "large") => void;
  gridArea?: string;
  isDraggable?: boolean;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  children,
  title,
  className,
  onRemove,
  id,
  size = "medium",
  position = { x: 0, y: 0 },
  onPositionChange,
  onSizeChange,
  gridArea,
  isDraggable = true,
}) => {
  const [widgetSize, setWidgetSize] = useState<"small" | "medium" | "large">(
    size,
  );
  const [isDragging, setIsDragging] = useState(false);

  // Update position if initialPosition changes (e.g. from parent component)
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const handleSizeToggle = () => {
    const newSize =
      widgetSize === "small"
        ? "medium"
        : widgetSize === "medium"
          ? "large"
          : "small";
    setWidgetSize(newSize);
    if (onSizeChange) {
      onSizeChange(id, newSize);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const newPosition = {
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    };
    if (onPositionChange) {
      onPositionChange(id, newPosition);
    }
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        gridArea ? `grid-area-${gridArea}` : "",
        className,
      )}
      style={{
        gridArea,
        zIndex: isDragging ? 50 : 1,
        x: position.x,
        y: position.y,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        width:
          widgetSize === "small"
            ? "100%"
            : widgetSize === "medium"
              ? "100%"
              : "100%",
        height:
          widgetSize === "small"
            ? "auto"
            : widgetSize === "medium"
              ? "auto"
              : "auto",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      drag={isDraggable}
<<<<<<< HEAD
      dragConstraints={false} // Remove constraints for smoother dragging
      dragTransition={{ power: 0.2, timeConstant: 200 }} // Optimize drag physics
      dragElastic={0} // Remove elasticity for more direct control
      dragMomentum={false} // Disable momentum for precise positioning
=======
      dragElastic={0.18}
      dragMomentum={true}
>>>>>>> 7dd8a8154bfa2c79cb46505af2f39d45155b9504
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
    >
      <Card
        className={cn(
          "h-full transition-all duration-300 overflow-hidden",
          isDragging
            ? "shadow-2xl ring-2 ring-primary/20"
            : "shadow-md hover:shadow-lg",
          widgetSize === "large" ? "col-span-2 row-span-2" : "",
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-background to-muted/30">
            <div className="flex items-center gap-2">
              {isDraggable && (
                <div className="cursor-move touch-none">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <h3 className="text-sm font-medium">{title}</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
                onClick={handleSizeToggle}
              >
                {widgetSize === "large" ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </Button>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  onClick={onRemove}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        )}
        <div className="p-4">{children}</div>
      </Card>
    </motion.div>
  );
};

export default DraggableWidget;
