import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  Users,
  MessageSquare,
  Clock,
  BarChart,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import AdminPageContainer from "./AdminPageContainer";

const Dashboard = () => {
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

  return (
    <AdminPageContainer
      title="Dashboard"
      description="Overview of your AI chat system performance and metrics."
    >

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="overview" className="flex-1">
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex-1">
            Performance
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex-1">
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
            {/* Total Users */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,546</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">+12.5%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                  <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "75%" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Total Conversations */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Total Conversations
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48,913</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">+18.2%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                  <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "65%" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Avg. Response Time */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Avg. Response Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2s</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">+5.1%</span>
                    <span className="ml-1">faster than last week</span>
                  </div>
                  <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* User Satisfaction */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    User Satisfaction
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.2%</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">+2.4%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                  <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "94%" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
            {/* Activity Chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Conversation Activity</CardTitle>
                <CardDescription>
                  Chat volume over the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full flex items-end gap-2">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const height = 30 + Math.random() * 70;
                    return (
                      <div
                        key={i}
                        className="relative flex-1 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors group"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute inset-x-0 bottom-0 bg-primary rounded-md transition-all duration-500" style={{ height: `${height}%` }} />
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-sm whitespace-nowrap transition-opacity">
                          {Math.floor(height * 10)} conversations
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Queries */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Top Queries</CardTitle>
                <CardDescription>
                  Most frequent user questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{index + 1}</span>
                        <span className="font-medium truncate max-w-[200px] md:max-w-[300px]">
                          {item.query}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.count}</span>
                        {item.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                        ) : item.trend === "down" ? (
                          <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Issues */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Issues</CardTitle>
              <CardDescription>
                Conversations that may require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                    className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className={`h-5 w-5 mt-0.5 ${item.status === "unresolved"
                          ? "text-red-500"
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Performance</CardTitle>
                <CardDescription>
                  Comparison of different AI models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Gemini Pro", accuracy: 94.2, speed: 1.1 },
                    { name: "Hugging Face T5", accuracy: 89.7, speed: 1.8 },
                    { name: "Custom Fine-tuned", accuracy: 96.3, speed: 1.5 },
                  ].map((model, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-sm">
                          {model.accuracy}% accuracy
                        </span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${model.accuracy}%` }}
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

            <Card>
              <CardHeader>
                <CardTitle>Response Quality</CardTitle>
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
                  ].map((item) => (
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
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.percentage}%` }}
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
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
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
                      className="flex items-center justify-between"
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

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
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
                        <span className="text-sm">{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.percentage}%` }}
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
    </AdminPageContainer>
  );
};

export default Dashboard;