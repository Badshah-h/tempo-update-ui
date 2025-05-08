import { AIModel } from "@/types/admin";

export const mockAIModels: AIModel[] = [
    {
        id: "gemini-pro",
        name: "Gemini Pro",
        provider: "Google",
        type: "Large Language Model",
        status: "active",
        performance: 94,
        costPerQuery: "$0.0010",
        apiKey: "AIza...",
    },
    {
        id: "huggingface-t5",
        name: "T5 Large",
        provider: "Hugging Face",
        type: "Text-to-Text",
        status: "active",
        performance: 89,
        costPerQuery: "$0.0005",
        apiKey: "hf_...",
    },
    {
        id: "custom-finetune",
        name: "Custom Fine-tuned",
        provider: "OpenAI",
        type: "Fine-tuned GPT",
        status: "inactive",
        performance: 96,
        costPerQuery: "$0.0020",
        apiKey: "sk-...",
    },
    {
        id: "llama-2",
        name: "Llama 2",
        provider: "Meta",
        type: "Open Source LLM",
        status: "inactive",
        performance: 91,
        costPerQuery: "$0.0008",
        apiKey: "meta_...",
    },
    {
        id: "mistral-7b",
        name: "Mistral 7B",
        provider: "Mistral AI",
        type: "Efficient LLM",
        status: "inactive",
        performance: 88,
        costPerQuery: "$0.0004",
        apiKey: "mistral_...",
    },
];

export const mockModelPerformance = {
    responseTime: {
        average: 1.2,
        trend: -0.2, // negative means improvement (faster)
        history: [1.4, 1.5, 1.3, 1.2, 1.1, 1.2, 1.2],
    },
    accuracy: {
        percentage: 94.2,
        trend: 2.1, // positive means improvement
        history: [92.1, 92.5, 93.0, 93.8, 94.0, 94.2, 94.2],
    },
    usage: {
        percentage: 68.5,
        trend: 5.3,
        history: [63.2, 64.1, 65.0, 66.2, 67.5, 68.0, 68.5],
    },
};

export const mockRecentQueries: Array<{
    query: string;
    time: string;
    tokens: number;
    success: boolean;
}> = [
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
