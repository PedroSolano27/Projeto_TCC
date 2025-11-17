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
