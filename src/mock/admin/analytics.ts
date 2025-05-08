import { AnalyticsData, TopQuery, Issue } from "@/types/admin";

export const mockAnalyticsData: AnalyticsData = {
    conversations: {
        total: 2853,
        trend: 12.5,
        chartData: [120, 132, 145, 162, 158, 172, 190, 210, 215, 230, 245, 260, 278, 290, 305],
    },
    messages: {
        total: 18472,
        trend: 18.2,
        chartData: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1520, 1600, 1700, 1800, 1850, 1900, 2000],
    },
    responseTime: {
        average: 1.8,
        trend: -12, // negative means improvement (faster)
        chartData: [2.2, 2.1, 2.0, 1.9, 1.9, 1.8, 1.8, 1.7, 1.7, 1.8, 1.8, 1.8, 1.7, 1.7, 1.8],
    },
    completionRate: {
        percentage: 94.2,
        trend: 2.1,
        chartData: [92.1, 92.3, 92.6, 93.0, 93.2, 93.5, 93.8, 94.0, 94.0, 94.1, 94.1, 94.2, 94.2, 94.2, 94.2],
    },
};

export const mockTopQueries: TopQuery[] = [
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
];

export const mockRecentIssues: Issue[] = [
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
];

export const mockUserEngagement = [
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
];

export const mockTrafficSources = [
    { source: "Direct Website", percentage: 45 },
    { source: "Mobile App", percentage: 30 },
    { source: "Embedded Widget", percentage: 20 },
    { source: "API Integration", percentage: 5 },
];
