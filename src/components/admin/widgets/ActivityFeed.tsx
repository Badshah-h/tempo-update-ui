import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  action: string;
  target: string;
  time: string;
  status?: "success" | "warning" | "error" | "info";
}

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  maxItems?: number;
  id?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = "Recent Activity",
  maxItems = 5,
  id,
}) => {
  const displayedActivities = activities.slice(0, maxItems);

  const statusColors = {
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    error: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-full w-full">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}

      <motion.div
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {displayedActivities.map((activity) => (
          <motion.div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-all duration-200"
            variants={item}
            whileHover={{ x: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {activity.user.initials || activity.user.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  <span className="font-semibold">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>

              {activity.status && (
                <Badge
                  variant="outline"
                  className={`text-xs ${statusColors[activity.status]}`}
                >
                  {activity.status.charAt(0).toUpperCase() +
                    activity.status.slice(1)}
                </Badge>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {activities.length > maxItems && (
        <div className="mt-4 text-center">
          <motion.button
            className="text-xs text-primary hover:text-primary/80 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View all activities
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
