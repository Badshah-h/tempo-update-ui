import React from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import AdminPageContainer from "./AdminPageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BarChart3,
    LineChart,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Calendar,
    RefreshCw,
    Users,
    MessageSquare,
    Clock,
    Zap,
} from "lucide-react";

const Analytics = () => {
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
            title="Analytics"
            description="Monitor your AI assistant's performance and usage metrics."
        >

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Select defaultValue="7d">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 hours</SelectItem>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                            <SelectItem value="custom">Custom range</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                        <Calendar className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Conversations
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2,853</div>
                            <p className="text-xs text-muted-foreground">
                                +12.5% from last period
                            </p>
                            <div className="mt-4 h-[60px] text-primary">
                                {/* Placeholder for chart */}
                                <div className="h-full w-full bg-primary/10 rounded-md flex items-center justify-center">
                                    <LineChart className="h-8 w-8 text-primary/40" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Messages Processed
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">18,472</div>
                            <p className="text-xs text-muted-foreground">
                                +18.2% from last period
                            </p>
                            <div className="mt-4 h-[60px] text-primary">
                                {/* Placeholder for chart */}
                                <div className="h-full w-full bg-primary/10 rounded-md flex items-center justify-center">
                                    <BarChart3 className="h-8 w-8 text-primary/40" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Avg. Response Time
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1.8s</div>
                            <div className="flex items-center gap-1 text-xs">
                                <ArrowDownRight className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">12% faster</span>
                                <span className="text-muted-foreground">than last period</span>
                            </div>
                            <div className="mt-4 h-[60px] text-primary">
                                {/* Placeholder for chart */}
                                <div className="h-full w-full bg-primary/10 rounded-md flex items-center justify-center">
                                    <LineChart className="h-8 w-8 text-primary/40" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Completion Rate
                            </CardTitle>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">94.2%</div>
                            <div className="flex items-center gap-1 text-xs">
                                <ArrowUpRight className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">2.1% increase</span>
                                <span className="text-muted-foreground">from last period</span>
                            </div>
                            <div className="mt-4 h-[60px] text-primary">
                                {/* Placeholder for chart */}
                                <div className="h-full w-full bg-primary/10 rounded-md flex items-center justify-center">
                                    <PieChart className="h-8 w-8 text-primary/40" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full max-w-md grid grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="conversations">Conversations</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Usage Overview</CardTitle>
                            <CardDescription>
                                Summary of your AI assistant's usage metrics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                                <BarChart3 className="h-16 w-16 text-muted" />
                                <span className="ml-2 text-muted">Chart visualization will appear here</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="conversations" className="pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Conversation Analytics</CardTitle>
                            <CardDescription>
                                Detailed metrics about user conversations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                                <LineChart className="h-16 w-16 text-muted" />
                                <span className="ml-2 text-muted">Chart visualization will appear here</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                            <CardDescription>
                                AI model performance and response time analytics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                                <PieChart className="h-16 w-16 text-muted" />
                                <span className="ml-2 text-muted">Chart visualization will appear here</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminPageContainer>
    );
};

export default Analytics;
