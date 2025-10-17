// Tipo para tarefa
export type Task = {
    id: string;
    title: string;
    tags: string[];
    notes?: string;
    points?: number;
    dueDate?: string;
    createdAt: string;
    xpReward?: number;
    completed: boolean;
    completedAt?: string;
    notificationId?: string | null;
};
