import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import AdminPageContainer from "./AdminPageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    FileText,
    Plus,
    Trash2,
    Edit,
    Save,
    Copy,
    Check,
    Zap,
    Tag,
    Filter,
    Search,
} from "lucide-react";

const PromptTemplates = () => {
    const [selectedTemplate, setSelectedTemplate] = useState("customer-support");
    const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    const templates = [
        {
            id: "customer-support",
            name: "Customer Support",
            description: "Handle customer inquiries and support requests",
            category: "Support",
            variables: ["customer_name", "product_name", "issue_description"],
            content:
                "You are a helpful customer support agent for {{product_name}}. Your goal is to assist {{customer_name}} with their issue: {{issue_description}}. Be empathetic, clear, and solution-oriented. If you don't know the answer, offer to escalate to a human agent.",
        },
        {
            id: "product-info",
            name: "Product Information",
            description: "Provide details about products and features",
            category: "Sales",
            variables: ["product_name", "product_version"],
            content:
                "You are a product specialist for {{product_name}} version {{product_version}}. Provide accurate and helpful information about features, capabilities, and use cases. Focus on benefits rather than technical specifications unless specifically asked.",
        },
        {
            id: "technical-support",
            name: "Technical Support",
            description: "Help with technical issues and troubleshooting",
            category: "Support",
            variables: ["user_name", "product_name", "technical_issue"],
            content:
                "You are a technical support specialist for {{product_name}}. Help {{user_name}} solve their technical issue: {{technical_issue}}. Provide step-by-step instructions and ask clarifying questions if needed. Be patient and thorough.",
        },
        {
            id: "sales-inquiry",
            name: "Sales Inquiry",
            description: "Handle sales questions and pricing inquiries",
            category: "Sales",
            variables: ["customer_name", "product_name"],
            content:
                "You are a sales representative for {{product_name}}. Your goal is to help {{customer_name}} understand the value proposition and pricing options. Be helpful but also work to qualify the lead and move them toward a purchase decision when appropriate.",
        },
    ];

    const copyTemplateContent = () => {
        const template = templates.find((t) => t.id === selectedTemplate);
        if (template) {
            navigator.clipboard.writeText(template.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

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
            title="Prompt Templates"
            description="Create and manage prompt templates for different conversation scenarios."
        >

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="onboarding">Onboarding</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search templates..."
                            className="pl-8 w-[250px]"
                        />
                    </div>
                </div>

                <Dialog open={showNewTemplateDialog} onOpenChange={setShowNewTemplateDialog}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Template</DialogTitle>
                            <DialogDescription>
                                Create a new prompt template for your AI assistant.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="E.g., Customer Onboarding"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">
                                    Category
                                </Label>
                                <Select>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="support">Support</SelectItem>
                                        <SelectItem value="sales">Sales</SelectItem>
                                        <SelectItem value="onboarding">Onboarding</SelectItem>
                                        <SelectItem value="technical">Technical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    placeholder="Brief description of this template"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="variables" className="text-right pt-2">
                                    Variables
                                </Label>
                                <div className="col-span-3 space-y-2">
                                    <div className="flex gap-2">
                                        <Input placeholder="E.g., customer_name" />
                                        <Button variant="outline" size="icon">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            customer_name
                                            <button className="ml-1 hover:text-destructive">
                                                ×
                                            </button>
                                        </Badge>
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            product_name
                                            <button className="ml-1 hover:text-destructive">
                                                ×
                                            </button>
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Use double curly braces to reference variables in your
                                        template: {'{{'} variable_name {'}}'}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="content" className="text-right pt-2">
                                    Template
                                </Label>
                                <Textarea
                                    id="content"
                                    placeholder="Enter your prompt template here..."
                                    className="col-span-3"
                                    rows={8}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowNewTemplateDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Create Template</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                <Card className="md:col-span-5 lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="text-lg">Templates</CardTitle>
                        <CardDescription>Available prompt templates</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <motion.div
                            className="flex flex-col"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {templates.map((template) => (
                                <motion.div key={template.id} variants={itemVariants}>
                                    <button
                                        className={`w-full flex items-start justify-between p-3 text-left hover:bg-muted transition-colors ${selectedTemplate === template.id ? "bg-muted" : ""}`}
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <FileText
                                                className={`h-5 w-5 mt-0.5 ${selectedTemplate === template.id ? "text-primary" : "text-muted-foreground"}`}
                                            />
                                            <div>
                                                <div className="font-medium">{template.name}</div>
                                                <div className="text-xs text-muted-foreground line-clamp-2">
                                                    {template.description}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {template.category}
                                        </Badge>
                                    </button>
                                    <Separator />
                                </motion.div>
                            ))}
                        </motion.div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-7 lg:col-span-8">
                    {templates
                        .filter((template) => template.id === selectedTemplate)
                        .map((template) => (
                            <div key={template.id}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>{template.name}</CardTitle>
                                        <CardDescription>{template.description}</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{template.category}</Badge>
                                        <div className="text-sm text-muted-foreground">
                                            {template.variables.length} variables
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Template Content</Label>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-1"
                                                onClick={copyTemplateContent}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="h-3.5 w-3.5" />
                                                        <span>Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-3.5 w-3.5" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <Textarea
                                                value={template.content}
                                                rows={8}
                                                className="font-mono text-sm"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Variables are enclosed in double curly braces, e.g.,
                                            {'{{'} "variable_name" {'}}'}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Variables</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {template.variables.map((variable) => (
                                                <Badge
                                                    key={variable}
                                                    variant="outline"
                                                    className="flex items-center gap-1 py-1.5"
                                                >
                                                    <Tag className="h-3 w-3 mr-1" />
                                                    {variable}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Test Template</h3>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {template.variables.map((variable) => (
                                                <div key={variable} className="space-y-2">
                                                    <Label htmlFor={`var-${variable}`}>
                                                        {variable.replace(/_/g, " ")}
                                                    </Label>
                                                    <Input
                                                        id={`var-${variable}`}
                                                        placeholder={`Enter ${variable.replace(/_/g, " ")}...`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <Button className="gap-2">
                                            <Zap className="h-4 w-4" />
                                            Test Template
                                        </Button>
                                    </div>
                                </CardContent>
                            </div>
                        ))}
                </Card>
            </div>
        </AdminPageContainer>
    );
};

export default PromptTemplates;