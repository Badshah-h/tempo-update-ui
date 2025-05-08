import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  Users,
  MessageSquare,
  Clock,
  BarChart,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Zap,
  Settings,
  Layers,
  PanelRight,
} from "lucide-react";
import AdminPageContainer from "./AdminPageContainer";

// Import our new components
import CustomizableDashboard from "./CustomizableDashboard";
import StatsWidget from "./widgets/StatsWidget";
import ChartWidget from "./widgets/ChartWidget";
import ActivityFeed from "./widgets/ActivityFeed";
import ThemeSwitcher from "./ThemeSwitcher";

const Dashboard = () => {
  const [showCustomize, setShowCustomize] = useState(false);
  const [activeView, setActiveView] = useState<"standard" | "custom">(
    (localStorage.getItem("dashboardView") as "standard" | "custom") ||
      "standard",
  );

  // Save the active view preference to localStorage
  useEffect(() => {
    localStorage.setItem("dashboardView", activeView);
  }, [activeView]);

  // Animation variants for staggered animations
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

  // Sample data for charts
  const conversationData = [
    120, 132, 145, 162, 158, 172, 190, 210, 215, 230, 245, 260, 278, 290, 305,
  ];
  const responseTimeData = [
    2.2, 2.1, 2.0, 1.9, 1.9, 1.8, 1.8, 1.7, 1.7, 1.8, 1.8, 1.8, 1.7, 1.7, 1.8,
  ];
  const dateLabels = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (14 - i));
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  // Sample activity data
  const recentActivities = [
    {
      id: "act-1",
      user: {
        name: "Admin User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        initials: "AU",
      },
      action: "updated",
      target: "widget configuration",
      time: "5 minutes ago",
      status: "success" as const,
    },
    {
      id: "act-2",
      user: {
        name: "John Manager",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        initials: "JM",
      },
      action: "added",
      target: "new prompt template",
      time: "2 hours ago",
      status: "info" as const,
    },
    {
      id: "act-3",
      user: {
        name: "Sarah Viewer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        initials: "SV",
      },
      action: "reported",
      target: "an issue with AI responses",
      time: "1 day ago",
      status: "warning" as const,
    },
  ];

  // Available widgets for customizable dashboard
  const availableWidgets = [
    { type: "users", title: "Total Users" },
    { type: "conversations", title: "Conversations" },
    { type: "response-time", title: "Response Time" },
    { type: "satisfaction", title: "User Satisfaction" },
    { type: "conversation-chart", title: "Conversation Trend" },
    { type: "response-time-chart", title: "Response Time Trend" },
    { type: "top-queries", title: "Top Queries" },
    { type: "recent-issues", title: "Recent Issues" },
    { type: "activity-feed", title: "Activity Feed" },
  ];

  // Default widgets for customizable dashboard
  const defaultWidgets = [
    {
      id: "widget-1",
      type: "users",
      title: "Total Users",
      size: "medium" as const,
      position: { x: 0, y: 0 },
    },
    {
      id: "widget-2",
      type: "conversations",
      title: "Conversations",
      size: "medium" as const,
      position: { x: 0, y: 0 },
    },
    {
      id: "widget-3",
      type: "conversation-chart",
      title: "Conversation Trend",
      size: "large" as const,
      position: { x: 0, y: 0 },
    },
    {
      id: "widget-4",
      type: "activity-feed",
      title: "Recent Activity",
      size: "medium" as const,
      position: { x: 0, y: 0 },
    },
  ];

  // Render widget based on type
  const renderWidget = (type: string, id: string) => {
    switch (type) {
      case "users":
        return (
          <StatsWidget
            title="Total Users"
            value="12,546"
            change={{ value: "+12.5%", trend: "up" }}
            icon={<Users className="h-4 w-4" />}
            id={id}
          />
        );
      case "conversations":
        return (
          <StatsWidget
            title="Total Conversations"
            value="48,913"
            change={{ value: "+18.2%", trend: "up" }}
            icon={<MessageSquare className="h-4 w-4" />}
            color="secondary"
            id={id}
          />
        );
      case "response-time":
        return (
          <StatsWidget
            title="Avg. Response Time"
            value="1.2"
            suffix="s"
            change={{ value: "-5.1%", trend: "up" }}
            icon={<Clock className="h-4 w-4" />}
            color="success"
            id={id}
          />
        );
      case "satisfaction":
        return (
          <StatsWidget
            title="User Satisfaction"
            value="94.2"
            suffix="%"
            change={{ value: "+2.4%", trend: "up" }}
            icon={<BarChart className="h-4 w-4" />}
            color="info"
            id={id}
          />
        );
      case "conversation-chart":
        return (
          <ChartWidget
            data={conversationData}
            labels={dateLabels}
            title="Conversation Trend"
            height={250}
            type="area"
            id={id}
          />
        );
      case "response-time-chart":
        return (
          <ChartWidget
            data={responseTimeData}
            labels={dateLabels}
            title="Response Time Trend"
            height={250}
            type="line"
            color="success"
            id={id}
          />
        );
      case "top-queries":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Top Queries</h3>
            {[
              {
                query: "How do I integrate the chat widget?",
                count: 342,
                trend: "up",
              },
              {
                query: "What AI models do you support?",
                count: 271,
                trend: "up",
              },
              {
                query: "How can I customize the appearance?",
                count: 234,
                trend: "down",
              },
              {
                query: "Is there an API available?",
                count: 198,
                trend: "up",
              },
              {
                query: "How much does it cost?",
                count: 187,
                trend: "same",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {index + 1}
                  </Badge>
                  <span className="font-medium truncate max-w-[200px] md:max-w-[300px]">
                    {item.query}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.count}</span>
                  {item.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : item.trend === "down" ? (
                    <TrendingUp className="h-3 w-3 text-rose-500 rotate-180" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        );
      case "recent-issues":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Recent Issues</h3>
            {[
              {
                query: "The AI didn't understand my question about pricing",
                time: "2 hours ago",
                status: "unresolved",
              },
              {
                query: "Widget not loading on Safari browser",
                time: "5 hours ago",
                status: "investigating",
              },
              {
                query: "Response was incorrect about product features",
                time: "1 day ago",
                status: "resolved",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors border-b last:border-0 pb-3 last:pb-0"
              >
                <AlertCircle
                  className={`h-5 w-5 mt-0.5 ${
                    item.status === "unresolved"
                      ? "text-rose-500"
                      : item.status === "investigating"
                        ? "text-amber-500"
                        : "text-emerald-500"
                  }`}
                />
                <div>
                  <div className="font-medium">{item.query}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.time} · {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "activity-feed":
        return <ActivityFeed activities={recentActivities} />;
      default:
        return <div>Widget not found</div>;
    }
  };

  return (
    <AdminPageContainer
      title="Dashboard"
      description="Overview of your AI chat system performance and metrics."
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant={activeView === "standard" ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setActiveView("standard")}
          >
            <Layers className="h-4 w-4" />
            Standard View
          </Button>
          <Button
            variant={activeView === "custom" ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setActiveView("custom")}
          >
            <PanelRight className="h-4 w-4" />
            Custom View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            onClick={() => setShowCustomize(!showCustomize)}
          >
            <motion.div
              animate={{ rotate: showCustomize ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </motion.div>
            {showCustomize ? "Hide Effects" : "Show Effects"}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === "standard" ? (
          <motion.div
            key="standard-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full max-w-md">
                <TabsTrigger value="overview" className="flex-1 gap-2">
                  <Zap className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex-1 gap-2">
                  <BarChart className="h-4 w-4" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="engagement" className="flex-1 gap-2">
                  <Users className="h-4 w-4" />
                  Engagement
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-6">
                <motion.div
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Stats Cards with Enhanced Animation */}
                  <motion.div variants={itemVariants}>
                    <Card
                      className={`overflow-hidden ${showCustomize ? "hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1" : ""}`}
                    >
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                          Total Users
                        </CardTitle>
                        <div
                          className={`p-2 rounded-lg bg-primary/10 ${showCustomize ? "animate-pulse-subtle" : ""}`}
                        >
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                          12,546
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" />
                          <span className="text-emerald-500 font-medium">
                            +12.5%
                          </span>
                          <span className="ml-1">from last month</span>
                        </div>
                        <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            transition={{
                              delay: 0.2,
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Total Conversations */}
                  <motion.div variants={itemVariants}>
                    <Card
                      className={`overflow-hidden ${showCustomize ? "hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1" : ""}`}
                    >
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                          Total Conversations
                        </CardTitle>
                        <div
                          className={`p-2 rounded-lg bg-secondary/10 ${showCustomize ? "animate-pulse-subtle" : ""}`}
                        >
                          <MessageSquare className="h-4 w-4 text-secondary" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
                          48,913
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" />
                          <span className="text-emerald-500 font-medium">
                            +18.2%
                          </span>
                          <span className="ml-1">from last month</span>
                        </div>
                        <div className="mt-3 h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-secondary to-secondary/80 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            transition={{
                              delay: 0.3,
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Avg. Response Time */}
                  <motion.div variants={itemVariants}>
                    <Card
                      className={`overflow-hidden ${showCustomize ? "hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1" : ""}`}
                    >
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                          Avg. Response Time
                        </CardTitle>
                        <div
                          className={`p-2 rounded-lg bg-emerald-500/10 ${showCustomize ? "animate-pulse-subtle" : ""}`}
                        >
                          <Clock className="h-4 w-4 text-emerald-500" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-500/80 bg-clip-text text-transparent">
                          1.2s
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" />
                          <span className="text-emerald-500 font-medium">
                            +5.1%
                          </span>
                          <span className="ml-1">faster than last week</span>
                        </div>
                        <div className="mt-3 h-2 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-500/80 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            transition={{
                              delay: 0.4,
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* User Satisfaction */}
                  <motion.div variants={itemVariants}>
                    <Card
                      className={`overflow-hidden ${showCustomize ? "hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1" : ""}`}
                    >
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                          User Satisfaction
                        </CardTitle>
                        <div
                          className={`p-2 rounded-lg bg-blue-500/10 ${showCustomize ? "animate-pulse-subtle" : ""}`}
                        >
                          <BarChart className="h-4 w-4 text-blue-500" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-500/80 bg-clip-text text-transparent">
                          94.2%
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" />
                          <span className="text-emerald-500 font-medium">
                            +2.4%
                          </span>
                          <span className="ml-1">from last month</span>
                        </div>
                        <div className="mt-3 h-2 w-full bg-blue-500/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-500/80 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "94%" }}
                            transition={{
                              delay: 0.5,
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
                  {/* Activity Chart with Enhanced Animation */}
                  <Card
                    className={`lg:col-span-4 ${showCustomize ? "hover:shadow-xl transition-shadow duration-300" : ""}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Conversation Activity
                      </CardTitle>
                      <CardDescription>
                        Chat volume over the past 30 days
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[300px] w-full">
                        <ChartWidget
                          data={Array.from(
                            { length: 30 },
                            () => Math.floor(Math.random() * 700) + 300,
                          )}
                          labels={Array.from({ length: 30 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - (29 - i));
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                          })}
                          height={300}
                          type="bar"
                          showLabels={false}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Queries with Enhanced Animation */}
                  <Card
                    className={`lg:col-span-3 ${showCustomize ? "hover:shadow-xl transition-shadow duration-300" : ""}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Top Queries
                      </CardTitle>
                      <CardDescription>
                        Most frequent user questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {renderWidget("top-queries", "top-queries-1")}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Issues */}
                <Card
                  className={`mt-6 ${showCustomize ? "hover:shadow-xl transition-shadow duration-300" : ""}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest updates and issues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ActivityFeed
                      activities={recentActivities}
                      title="Recent Activity"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card
                    className={
                      showCustomize
                        ? "hover:shadow-xl transition-shadow duration-300"
                        : ""
                    }
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        AI Model Performance
                      </CardTitle>
                      <CardDescription>
                        Comparison of different AI models
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: "Gemini Pro", accuracy: 94.2, speed: 1.1 },
                          {
                            name: "Hugging Face T5",
                            accuracy: 89.7,
                            speed: 1.8,
                          },
                          {
                            name: "Custom Fine-tuned",
                            accuracy: 96.3,
                            speed: 1.5,
                          },
                        ].map((model, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{model.name}</span>
                              <span className="text-sm">
                                {model.accuracy}% accuracy
                              </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${model.accuracy}%` }}
                                transition={{
                                  delay: index * 0.2,
                                  duration: 0.8,
                                  ease: "easeOut",
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Response time: {model.speed}s</span>
                              <span>
                                {model.accuracy < 90
                                  ? "Needs improvement"
                                  : model.accuracy < 95
                                    ? "Good"
                                    : "Excellent"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={
                      showCustomize
                        ? "hover:shadow-xl transition-shadow duration-300"
                        : ""
                    }
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Response Quality
                      </CardTitle>
                      <CardDescription>
                        User ratings of AI responses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {[
                          { rating: 5, percentage: 68 },
                          { rating: 4, percentage: 22 },
                          { rating: 3, percentage: 7 },
                          { rating: 2, percentage: 2 },
                          { rating: 1, percentage: 1 },
                        ].map((item, index) => (
                          <div key={item.rating} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`h-4 w-4 ${i < item.rating ? "text-yellow-400" : "text-muted"}`}
                                  >
                                    ★
                                  </div>
                                ))}
                              </div>
                              <span className="text-sm font-medium">
                                {item.percentage}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{
                                  delay: index * 0.2,
                                  duration: 0.8,
                                  ease: "easeOut",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="engagement" className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card
                    className={
                      showCustomize
                        ? "hover:shadow-xl transition-shadow duration-300"
                        : ""
                    }
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        User Engagement
                      </CardTitle>
                      <CardDescription>
                        How users interact with the chat widget
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            metric: "Average Session Duration",
                            value: "4m 32s",
                            change: "+12%",
                          },
                          {
                            metric: "Messages per Conversation",
                            value: "6.8",
                            change: "+5%",
                          },
                          {
                            metric: "Return Rate",
                            value: "42%",
                            change: "+8%",
                          },
                          {
                            metric: "Conversation Completion",
                            value: "87%",
                            change: "+3%",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <span className="font-medium">{item.metric}</span>
                            <div className="flex items-center gap-2">
                              <span>{item.value}</span>
                              <span className="text-xs text-emerald-500">
                                {item.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={
                      showCustomize
                        ? "hover:shadow-xl transition-shadow duration-300"
                        : ""
                    }
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        Traffic Sources
                      </CardTitle>
                      <CardDescription>
                        Where users are accessing the chat from
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { source: "Direct Website", percentage: 45 },
                          { source: "Mobile App", percentage: 30 },
                          { source: "Embedded Widget", percentage: 20 },
                          { source: "API Integration", percentage: 5 },
                        ].map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.source}</span>
                              <span className="text-sm">
                                {item.percentage}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{
                                  delay: index * 0.2,
                                  duration: 0.8,
                                  ease: "easeOut",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <motion.div
            key="custom-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CustomizableDashboard
              defaultWidgets={defaultWidgets}
              renderWidget={renderWidget}
              availableWidgets={availableWidgets}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AdminPageContainer>
  );
};

export default Dashboard;
