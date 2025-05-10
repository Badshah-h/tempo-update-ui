import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Zap, Loader2 } from "lucide-react";
import { testAiModel } from "@/services/aiModelService";
import { AiModelConfig } from "@/types/ai";

interface ModelTestTabProps {
    model: AiModelConfig;
    toast: any;
}

interface TestResponse {
    content: string;
    metadata: {
        response_time: number;
        tokens_used: number;
        estimated_cost: number;
    };
}

const ModelTestTab: React.FC<ModelTestTabProps> = ({ model, toast }) => {
    const [testQuery, setTestQuery] = useState(
        "What are the key features of your AI chat system?"
    );
    const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
    const [testLoading, setTestLoading] = useState(false);

    const handleRunTest = async () => {
        if (!testQuery) return;

        try {
            setTestLoading(true);
            const response = await testAiModel(model.id.toString(), testQuery);
            setTestResponse(response);
            setTestLoading(false);
        } catch (error) {
            console.error(`Failed to test model ${model.id}:`, error);
            toast({
                variant: "destructive",
                title: "Test failed",
                description: "Failed to test AI model. Please try again later.",
            });
            setTestLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Test Model</CardTitle>
                <CardDescription>
                    Try out the model with sample queries
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="testQuery">Test Query</Label>
                    <Textarea
                        id="testQuery"
                        placeholder="Enter a test query here..."
                        rows={3}
                        value={testQuery}
                        onChange={(e) => setTestQuery(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        className="gap-2"
                        onClick={handleRunTest}
                        disabled={testLoading}
                    >
                        {testLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Zap className="h-4 w-4" />
                        )}
                        Run Test
                    </Button>
                </div>

                {testResponse && (
                    <>
                        <Separator />

                        <div className="space-y-2">
                            <Label>Response</Label>
                            <div className="p-4 bg-muted rounded-md">
                                <p className="whitespace-pre-wrap">
                                    {testResponse.content}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-1">
                                <div className="text-sm font-medium">Response Time</div>
                                <div className="text-xl font-bold">
                                    {testResponse.metadata.response_time}s
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium">Tokens Used</div>
                                <div className="text-xl font-bold">
                                    {testResponse.metadata.tokens_used}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium">Estimated Cost</div>
                                <div className="text-xl font-bold">
                                    ${testResponse.metadata.estimated_cost.toFixed(6)}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default ModelTestTab; 