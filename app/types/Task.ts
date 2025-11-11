export type Task = {
    id: string;
    title: string;
    selectedTag: string;
    notes?: string;
    dueDate?: string;
    createdAt: string;
    completed: boolean;
    completedAt?: string;
    notificationIds?: string[];
};
