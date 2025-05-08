export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "manager" | "viewer";
    avatarUrl: string;
    lastActive: Date;
}

export const mockUsers: User[] = [
    {
        id: "user-1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        lastActive: new Date(),
    },
    {
        id: "user-2",
        name: "John Manager",
        email: "john@example.com",
        role: "manager",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        lastActive: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
        id: "user-3",
        name: "Sarah Viewer",
        email: "sarah@example.com",
        role: "viewer",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        lastActive: new Date(Date.now() - 172800000), // 2 days ago
    },
];

export const currentUser = mockUsers[0];
