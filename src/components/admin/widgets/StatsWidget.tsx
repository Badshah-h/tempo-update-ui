import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";

interface StatsWidgetProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  color?: string;
  prefix?: string;
  suffix?: string;
  id?: string;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
  title,
  value,
  change,
  icon,
  color = "primary",
  prefix = "",
  suffix = "",
  id,
}) => {
  const colorClasses =
    {
      primary: "from-primary/20 to-primary/5 text-primary",
      secondary: "from-secondary/20 to-secondary/5 text-secondary",
      success: "from-emerald-500/20 to-emerald-500/5 text-emerald-500",
      warning: "from-amber-500/20 to-amber-500/5 text-amber-500",
      info: "from-blue-500/20 to-blue-500/5 text-blue-500",
      danger: "from-rose-500/20 to-rose-500/5 text-rose-500",
    }[color] || "from-primary/20 to-primary/5 text-primary";

  const trendColor =
    change?.trend === "up"
      ? "text-emerald-500"
      : change?.trend === "down"
        ? "text-rose-500"
        : "text-muted-foreground";

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg border bg-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div
        className="absolute top-0 right-0 h-24 w-24 -mt-8 -mr-8 rounded-full bg-gradient-radial opacity-70"
        style={{
          background: `radial-gradient(circle, var(--${color === "primary" ? "primary" : color}) 0%, transparent 70%)`,
        }}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline">
        <div className="text-3xl font-bold tracking-tight">
          {prefix}
          {value}
          {suffix}
        </div>

        {change && (
          <div className={`ml-2 flex items-center text-xs ${trendColor}`}>
            {change.trend === "up" ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : change.trend === "down" ? (
              <TrendingDown className="h-3 w-3 mr-1" />
            ) : (
              <span className="h-3 w-3 mr-1">→</span>
            )}
            {change.value}
          </div>
        )}
      </div>

      <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${colorClasses}`}
          initial={{ width: "0%" }}
          animate={{ width: "70%" }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export default StatsWidget;
