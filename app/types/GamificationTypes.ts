// Tipos para Gamificação

export type Badge = {
    id: string;
    title: string;
    icon?: string;
    awardedAt?: string;
    description: string;
};

export type UserProfile = {
    id: string;
    xp: number;
    level: number;
    coins: number;
    streak: number;
    points: number;
    badges: Badge[];
    lastCompletionDate: string | null;
};

export type Transaction = {
    id: string;
    date: string;
    amount: number;
    reason: string;
    type: "earn" | "spend";
};
