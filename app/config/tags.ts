export type TagRewardConfig = {
    id: string;
    label: string;
    basePoints: number;
    baseXP: number;
    description: string;
    icon?: string;
};

export const TAG_REWARDS: Record<string, TagRewardConfig> = {
    urgent: {
        id: "urgent",
        label: "Urgente",
        basePoints: 20,
        baseXP: 15,
        description: "Tarefa urgente com alta prioridade",
    },
    important: {
        id: "important",
        label: "Importante",
        basePoints: 15,
        baseXP: 12,
        description: "Tarefa importante",
    },
    work: {
        id: "work",
        label: "Trabalho",
        basePoints: 10,
        baseXP: 8,
        description: "Tarefa relacionada ao trabalho",
    },
    study: {
        id: "study",
        label: "Estudo",
        basePoints: 12,
        baseXP: 10,
        description: "Tarefa relacionada aos estudos",
    },
    personal: {
        id: "personal",
        label: "Pessoal",
        basePoints: 8,
        baseXP: 6,
        description: "Tarefa pessoal",
    },
    health: {
        id: "health",
        label: "Saúde",
        basePoints: 14,
        baseXP: 11,
        description: "Tarefa relacionada à saúde e exercício",
    },
    finance: {
        id: "finance",
        label: "Finanças",
        basePoints: 16,
        baseXP: 13,
        description: "Tarefa financeira",
    },
    creative: {
        id: "creative",
        label: "Criativo",
        basePoints: 11,
        baseXP: 9,
        description: "Atividade criativa ou projeto artístico",
    },
};

export const DEFAULT_TAG = "personal";

export function getTagRewards(tagId: string): TagRewardConfig {
    return TAG_REWARDS[tagId] || TAG_REWARDS[DEFAULT_TAG];
}

export function getAllTags(): TagRewardConfig[] {
    return Object.values(TAG_REWARDS);
}
