import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { getAiProviders, createAiModelConfig } from "@/services/aiModelService";
import { AiProvider } from "@/types/ai";

interface AddModelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onModelAdded: () => void;
    toast: any;
}

const AddModelDialog: React.FC<AddModelDialogProps> = ({ open, onOpenChange, onModelAdded, toast }) => {
    const [providers, setProviders] = useState<AiProvider[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        ai_provider_id: "",
        model_id: "",
        credentials: "",
        parameters: "",
        system_prompt: "You are a helpful AI assistant."
    });
    const [modelOptions, setModelOptions] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            fetchProviders();
        }
    }, [open]);

    const fetchProviders = async () => {
        try {
            const data = await getAiProviders();
            setProviders(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to load providers",
                description: "Could not load AI providers. Please try again later.",
            });
        }
    };

    const handleProviderChange = (providerId: string) => {
        setForm({ ...form, ai_provider_id: providerId, model_id: "" });
        const provider = providers.find(p => p.id.toString() === providerId);
        setModelOptions(provider?.available_models || []);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleModelChange = (modelId: string) => {
        setForm({ ...form, model_id: modelId });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createAiModelConfig({
                name: form.name,
                ai_provider_id: Number(form.ai_provider_id),
                model_id: form.model_id,
                credentials: form.credentials ? JSON.parse(form.credentials) : {},
                parameters: form.parameters ? JSON.parse(form.parameters) : {},
                system_prompt: form.system_prompt,
                is_active: true,
            });
            toast({
                title: "Model added",
                description: "AI model was successfully created.",
            });
            setLoading(false);
            onOpenChange(false);
            onModelAdded();
            setForm({
                name: "",
                ai_provider_id: "",
                model_id: "",
                credentials: "",
                parameters: "",
                system_prompt: "You are a helpful AI assistant."
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Failed to add model",
                description: error?.response?.data?.message || "Please check your input and try again.",
            });
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New AI Model</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new AI model configuration.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {providers.length === 0 && (
                        <div className="p-4 text-center text-destructive border border-destructive rounded">
                            No AI providers are available. Please add a provider first.
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="name">Model Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            required
                            disabled={providers.length === 0}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ai_provider_id">Provider</Label>
                        <Select
                            value={form.ai_provider_id}
                            onValueChange={handleProviderChange}
                            required
                            disabled={providers.length === 0}
                        >
                            <SelectTrigger id="ai_provider_id">
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                {providers.map((provider) => (
                                    <SelectItem key={provider.id} value={provider.id.toString()}>
                                        {provider.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="model_id">Model</Label>
                        <Select
                            value={form.model_id}
                            onValueChange={handleModelChange}
                            required
                            disabled={!form.ai_provider_id || providers.length === 0}
                        >
                            <SelectTrigger id="model_id">
                                <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                                {modelOptions.map((model) => (
                                    <SelectItem key={model} value={model}>
                                        {model}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="api_key">API Key</Label>
                        <Input
                            id="api_key"
                            name="api_key"
                            value={form.credentials ? ((JSON.parse(form.credentials) as Record<string, any>).api_key || "") : ""}
                            onChange={e => {
                                let creds: Record<string, any> = {};
                                try {
                                    creds = form.credentials ? (JSON.parse(form.credentials) as Record<string, any>) : {};
                                } catch { creds = {}; }
                                creds.api_key = e.target.value;
                                setForm({ ...form, credentials: JSON.stringify(creds) });
                            }}
                            placeholder="sk-..."
                            disabled={providers.length === 0}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="credentials">Credentials (JSON)</Label>
                        <Textarea
                            id="credentials"
                            name="credentials"
                            value={form.credentials}
                            onChange={handleInputChange}
                            placeholder='{"api_key": "sk-..."}'
                            rows={2}
                            disabled={providers.length === 0}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="parameters">Parameters (JSON)</Label>
                        <Textarea
                            id="parameters"
                            name="parameters"
                            value={form.parameters}
                            onChange={handleInputChange}
                            placeholder='{"temperature": 0.7, "max_tokens": 1024, "top_p": 0.9}'
                            rows={2}
                            disabled={providers.length === 0}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="system_prompt">System Prompt</Label>
                        <Textarea
                            id="system_prompt"
                            name="system_prompt"
                            value={form.system_prompt}
                            onChange={handleInputChange}
                            rows={2}
                            disabled={providers.length === 0}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={providers.length === 0}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading || providers.length === 0}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Add Model
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddModelDialog; 