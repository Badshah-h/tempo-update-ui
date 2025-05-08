import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ChartWidgetProps {
  data: number[];
  labels?: string[];
  title?: string;
  height?: number;
  color?: string;
  id?: string;
  type?: "bar" | "line" | "area";
  showLabels?: boolean;
  animate?: boolean;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({
  data,
  labels,
  title,
  height = 200,
  color = "primary",
  id,
  type = "bar",
  showLabels = true,
  animate = true,
}) => {
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const [animatedData, setAnimatedData] = useState<number[]>(data.map(() => 0));

  useEffect(() => {
    if (animate) {
      setAnimatedData(data.map(() => 0));
      const timeout = setTimeout(() => {
        setAnimatedData(data);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setAnimatedData(data);
    }
  }, [data, animate]);

  const maxValue = Math.max(...data) * 1.2;
  const normalizedData = data.map((value) => (value / maxValue) * 100);

  const colorClasses =
    {
      primary: "from-primary to-primary/50",
      secondary: "from-secondary to-secondary/50",
      success: "from-emerald-500 to-emerald-500/50",
      warning: "from-amber-500 to-amber-500/50",
      info: "from-blue-500 to-blue-500/50",
      danger: "from-rose-500 to-rose-500/50",
    }[color] || "from-primary to-primary/50";

  const renderChart = () => {
    switch (type) {
      case "line":
        return renderLineChart();
      case "area":
        return renderAreaChart();
      case "bar":
      default:
        return renderBarChart();
    }
  };

  const renderBarChart = () => (
    <div className="flex items-end h-full gap-1 px-2">
      {normalizedData.map((value, index) => (
        <motion.div
          key={index}
          className="relative flex-1 group"
          onMouseEnter={() => setIsHovering(index)}
          onMouseLeave={() => setIsHovering(null)}
        >
          <motion.div
            className={`w-full rounded-t-md bg-gradient-premium ${colorClasses}`}
            initial={{ height: 0 }}
            animate={{ height: `${(animatedData[index] / maxValue) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              opacity:
                isHovering === index ? 1 : isHovering !== null ? 0.7 : 0.9,
              boxShadow:
                isHovering === index
                  ? "0 0 10px rgba(var(--primary), 0.3)"
                  : "none",
            }}
          />
          {showLabels && labels && (
            <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-muted-foreground">
              {labels[index]}
            </div>
          )}
          {isHovering === index && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-sm whitespace-nowrap">
              {data[index]}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderLineChart = () => {
    const points = normalizedData
      .map((value, index) => {
        const x = (index / (normalizedData.length - 1)) * 100;
        const y = 100 - value;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="relative h-full w-full">
        <svg className="h-full w-full" preserveAspectRatio="none">
          <motion.polyline
            points={points}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`stroke-${color === "primary" ? "primary" : color}`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {normalizedData.map((value, index) => {
            const x = (index / (normalizedData.length - 1)) * 100;
            const y = 100 - value;
            return (
              <motion.circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                className={`fill-background stroke-${color === "primary" ? "primary" : color}`}
                strokeWidth="1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.05, duration: 0.3 }}
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(null)}
              />
            );
          })}
        </svg>
        {showLabels && labels && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
            {labels.map((label, index) => (
              <div key={index} className="text-xs text-muted-foreground">
                {label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAreaChart = () => {
    const points = normalizedData
      .map((value, index) => {
        const x = (index / (normalizedData.length - 1)) * 100;
        const y = 100 - value;
        return `${x},${y}`;
      })
      .join(" ");

    // Create area by adding bottom corners
    const areaPoints = `${points} 100,100 0,100`;

    return (
      <div className="relative h-full w-full">
        <svg className="h-full w-full" preserveAspectRatio="none">
          <motion.polygon
            points={areaPoints}
            className={`fill-${color === "primary" ? "primary" : color}/10 stroke-${color === "primary" ? "primary" : color}`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          {normalizedData.map((value, index) => {
            const x = (index / (normalizedData.length - 1)) * 100;
            const y = 100 - value;
            return (
              <motion.circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                className={`fill-background stroke-${color === "primary" ? "primary" : color}`}
                strokeWidth="1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.05, duration: 0.3 }}
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(null)}
              />
            );
          })}
        </svg>
        {showLabels && labels && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
            {labels.map((label, index) => (
              <div key={index} className="text-xs text-muted-foreground">
                {label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}
      <div style={{ height: `${height}px` }} className="relative">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartWidget;
