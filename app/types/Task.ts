// Tipo para tarefa
export type Task = {
    id: string;
    title: string;
    notes?: string;
    dueDate?: string;
    createdAt: string;
    completed: boolean;
    notificationId?: string | null;
};
