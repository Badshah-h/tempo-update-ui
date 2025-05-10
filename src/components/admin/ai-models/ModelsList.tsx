import React from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AiModelConfig } from "@/types/ai";

interface ModelsListProps {
    models: AiModelConfig[];
    activeModel: string | null;
    setActiveModel: (id: string) => void;
    isLoading: boolean;
}

const ModelsList: React.FC<ModelsListProps> = ({
    models,
    activeModel,
    setActiveModel,
    isLoading,
}) => {
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
        <Card className="md:w-64 lg:w-72">
            <CardHeader>
                <CardTitle className="text-lg">Models</CardTitle>
                <CardDescription>Available AI models</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <motion.div
                    className="flex flex-col"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {models.map((model) => (
                        <motion.div key={model.id} variants={itemVariants}>
                            <button
                                className={`w-full flex items-center justify-between p-3 text-left hover:bg-muted transition-colors ${activeModel === model.id.toString() ? "bg-muted" : ""
                                    }`}
                                onClick={() => setActiveModel(model.id.toString())}
                            >
                                <div className="flex items-center gap-3">
                                    <Brain
                                        className={`h-5 w-5 ${activeModel === model.id.toString()
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                            }`}
                                    />
                                    <div>
                                        <div className="font-medium">{model.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {model.provider?.name || "Unknown Provider"}
                                        </div>
                                    </div>
                                </div>
                                <Badge
                                    variant={model.is_active ? "default" : "outline"}
                                    className="text-xs"
                                >
                                    {model.is_active ? "active" : "inactive"}
                                </Badge>
                            </button>
                            <Separator />
                        </motion.div>
                    ))}

                    {models.length === 0 && !isLoading && (
                        <div className="p-4 text-center text-muted-foreground">
                            No AI models configured yet
                        </div>
                    )}
                </motion.div>
            </CardContent>
        </Card>
    );
};

export default ModelsList; 