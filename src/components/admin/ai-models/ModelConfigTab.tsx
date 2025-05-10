import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Trash2, Edit, Save, Loader2 } from "lucide-react";
import { AiModelConfig } from "@/types/ai";
import { updateAiModelConfig, toggleAiModelConfigActive } from "@/services/aiModelService";

interface ModelConfigTabProps {
    model: AiModelConfig;
    onDelete: (modelId: number) => void;
    onModelUpdate: (updatedModel: AiModelConfig) => void;
    toast: any;
}

const ModelConfigTab: React.FC<ModelConfigTabProps> = ({
    model,
    onDelete,
    onModelUpdate,
    toast
}) => {
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        temperature: 0.7,
        maxTokens: 1024,
        topP: 0.9,
        presencePenalty: 0,
        systemPrompt: ""
    });
    const [originalData, setOriginalData] = useState(formData);

    useEffect(() => {
        const params = model.parameters || {};
        const newData = {
            temperature: params.temperature || 0.7,
            maxTokens: params.max_tokens || 1024,
            topP: params.top_p || 0.9,
            presencePenalty: params.presence_penalty || 0,
            systemPrompt: model.system_prompt || "You are a helpful AI assistant for our company. Answer questions accurately and concisely based on the provided context. If you don't know the answer, say so rather than making up information."
        };
        setFormData(newData);
        setOriginalData(newData);
        setIsEditing(false);
    }, [model]);

    const handleToggleActive = async () => {
        try {
            await toggleAiModelConfigActive(model.id.toString());
            onModelUpdate({
                ...model,
                is_active: !model.is_active
            });
            toast({
                title: "Status updated",
                description: `Model is now ${!model.is_active ? 'active' : 'inactive'}`,
            });
        } catch (error) {
            console.error(`Failed to toggle model ${model.id} status:`, error);
            toast({
                variant: "destructive",
                title: "Failed to update model status",
                description: "Please try again later",
            });
        }
    };

    const handleSaveChanges = async () => {
        try {
            setSaving(true);
            const parameters = {
                ...model.parameters,
                temperature: formData.temperature,
                max_tokens: formData.maxTokens,
                top_p: formData.topP,
                presence_penalty: formData.presencePenalty,
            };
            const response = await updateAiModelConfig(model.id.toString(), {
                parameters,
                system_prompt: formData.systemPrompt,
            });
            onModelUpdate({
                ...model,
                parameters,
                system_prompt: formData.systemPrompt
            });
            toast({
                title: "Configuration saved",
                description: "Model configuration has been updated",
            });
            setOriginalData(formData);
            setIsEditing(false);
            setSaving(false);
        } catch (error) {
            console.error(`Failed to update model ${model.id}:`, error);
            toast({
                variant: "destructive",
                title: "Failed to save configuration",
                description: "Please try again later",
            });
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{model.name}</CardTitle>
                    <CardDescription>
                        {model.type || "AI Model"} by {model.provider?.name || "Unknown Provider"}
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(model.id)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    {!isEditing ? (
                        <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <Input
                            id="apiKey"
                            type="password"
                            value={model.credentials?.api_key || "••••••••••••••••"}
                            readOnly
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="modelStatus">Status</Label>
                        <div className="flex items-center justify-between">
                            <span>
                                {model.is_active ? "Active" : "Inactive"}
                            </span>
                            <Switch
                                id="modelStatus"
                                checked={model.is_active}
                                onCheckedChange={handleToggleActive}
                            />
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Model Parameters</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="temperature">Temperature</Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    id="temperature"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    value={[formData.temperature]}
                                    onValueChange={(value) => { if (isEditing) setFormData({ ...formData, temperature: value[0] }); }}
                                    className="flex-1"
                                    disabled={!isEditing}
                                />
                                <span className="w-12 text-center">{formData.temperature}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Controls randomness: lower values are more deterministic
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxTokens">Max Tokens</Label>
                            <Input
                                id="maxTokens"
                                type="number"
                                value={formData.maxTokens}
                                onChange={(e) => { if (isEditing) setFormData({ ...formData, maxTokens: parseInt(e.target.value) }); }}
                                disabled={!isEditing}
                            />
                            <p className="text-xs text-muted-foreground">
                                Maximum number of tokens to generate
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="topP">Top P</Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    id="topP"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={[formData.topP]}
                                    onValueChange={(value) => { if (isEditing) setFormData({ ...formData, topP: value[0] }); }}
                                    className="flex-1"
                                    disabled={!isEditing}
                                />
                                <span className="w-12 text-center">{formData.topP}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="presencePenalty">
                                Presence Penalty
                            </Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    id="presencePenalty"
                                    min={-2}
                                    max={2}
                                    step={0.1}
                                    value={[formData.presencePenalty]}
                                    onValueChange={(value) => { if (isEditing) setFormData({ ...formData, presencePenalty: value[0] }); }}
                                    className="flex-1"
                                    disabled={!isEditing}
                                />
                                <span className="w-12 text-center">{formData.presencePenalty.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Prompt</h3>
                    <div className="space-y-2">
                        <Label htmlFor="systemPrompt">Default Prompt</Label>
                        <Textarea
                            id="systemPrompt"
                            rows={4}
                            value={formData.systemPrompt}
                            onChange={(e) => { if (isEditing) setFormData({ ...formData, systemPrompt: e.target.value }); }}
                            disabled={!isEditing}
                        />
                        <p className="text-xs text-muted-foreground">
                            This prompt will be used as the default system instruction for this model
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {isEditing ? (
                    <>
                        <Button className="gap-2" onClick={handleSaveChanges} disabled={saving}>
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancel} disabled={saving}>
                            Cancel
                        </Button>
                    </>
                ) : null}
            </CardFooter>
        </Card>
    );
};

export default ModelConfigTab; 