import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

const ModelEmptyState: React.FC = () => {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-center space-y-2 py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-medium">No AI Model Selected</h3>
                    <p className="text-muted-foreground">
                        Select an AI model from the sidebar or add a new one to get started
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ModelEmptyState; 