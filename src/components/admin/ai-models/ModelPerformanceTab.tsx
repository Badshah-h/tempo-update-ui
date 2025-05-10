import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AiModelConfig } from "@/types/ai";

interface ModelPerformanceTabProps {
    model: AiModelConfig;
}

// Mock data - in a real app, this would come from the API
const recentQueries = [
    {
        query: "How do I integrate the chat widget?",
        time: "1.1s",
        tokens: 156,
        success: true,
    },
    {
        query: "What AI models do you support?",
        time: "0.9s",
        tokens: 128,
        success: true,
    },
    {
        query: "Can you explain quantum computing in simple terms?",
        time: "1.8s",
        tokens: 312,
        success: true,
    },
    {
        query: "What's the pricing for enterprise plans?",
        time: "1.2s",
        tokens: 187,
        success: false,
    },
    {
        query: "How to customize the widget appearance?",
        time: "1.0s",
        tokens: 203,
        success: true,
    },
];

const ModelPerformanceTab: React.FC<ModelPerformanceTabProps> = ({ model }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                    Analyze how this model is performing
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Response Time</div>
                        <div className="text-2xl font-bold">1.2s</div>
                        <div className="text-xs text-muted-foreground">
                            Average over last 7 days
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-2">
                            <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: "85%" }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm font-medium">Accuracy</div>
                        <div className="text-2xl font-bold">{model.performance_score}%</div>
                        <div className="text-xs text-muted-foreground">
                            Based on user feedback
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-2">
                            <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${model.performance_score}%` }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm font-medium">Usage</div>
                        <div className="text-2xl font-bold">68.5%</div>
                        <div className="text-xs text-muted-foreground">
                            Of total queries
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-2">
                            <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: "68%" }}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="text-lg font-medium mb-4">Recent Queries</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Query</TableHead>
                                <TableHead>Response Time</TableHead>
                                <TableHead>Tokens</TableHead>
                                <TableHead>Success</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentQueries.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium truncate max-w-[200px]">
                                        {item.query}
                                    </TableCell>
                                    <TableCell>{item.time}</TableCell>
                                    <TableCell>{item.tokens}</TableCell>
                                    <TableCell>
                                        {item.success ? (
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default ModelPerformanceTab; 