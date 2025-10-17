// Gamificação

// Tipos
import { Badge } from "../types/GamificationTypes";
import { Task } from "../types/Task";

// Terceiros
import {
    loadProfile,
    requiredXpForLevel,
    saveProfile,
} from "./UserProfileStorage";

function todayString() {
    return new Date().toISOString().slice(0, 10);
}

// Aplica recompensas de completar tarefas
export async function applyCompletionRewards(
    task: Task,
    extra?: { basePoints?: number },
) {
    const profile = await loadProfile();

    const basePoints = extra?.basePoints ?? task.xpReward ?? 10;
    const tagBonus = task.tags?.includes("important") ? 5 : 0;

    // Se completou ontem, usa streak+1; Se já completou hoje, não duplica
    const last = profile.lastCompletionDate
        ? profile.lastCompletionDate.slice(0, 10)
        : null;

    const today = todayString();

    let newStreak = 1;

    if (last) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (last === yesterday.toISOString().slice(0, 10))
            newStreak = Math.min(profile.streak + 1, 365);
        else if (last === today) newStreak = profile.streak; // Já contabilizado
    }

    const streakBonus = Math.min(newStreak, 7) * 2;
    const points = basePoints + tagBonus + streakBonus;
    const xpGain = Math.floor(points * 1.0);

    profile.points = (profile.points ?? 0) + points;
    profile.coins = (profile.coins ?? 0) + Math.floor(points / 5);
    profile.xp = (profile.xp ?? 0) + xpGain;

    // Loop de level up
    let leveledUp = false;
    while (profile.xp >= requiredXpForLevel(profile.level + 1)) {
        profile.xp -= requiredXpForLevel(profile.level + 1);
        profile.level += 1;
        leveledUp = true;
    }

    // Atualiza streak e lastCompletionDate
    profile.streak = newStreak;
    profile.lastCompletionDate = today;

    // Badges simples
    const newBadges: Badge[] = [];
    if (!profile.badges.some((b) => b.id === "first-task")) {
        newBadges.push({
            id: "first-task",
            title: "Primeira tarefa",
            description: "Concluiu a primeira tarefa",
            awardedAt: new Date().toISOString(),
        });
    }

    if (
        !profile.badges.some((b) => b.id === "7-day-streak") &&
        profile.streak >= 7
    ) {
        newBadges.push({
            id: "7-day-streak",
            title: "7 dias seguidos",
            description: "Concluiu tarefas por 7 dias consecutivos",
            awardedAt: new Date().toISOString(),
        });
    }

    if (newBadges.length) {
        profile.badges = [...(profile.badges ?? []), ...newBadges];
    }

    await saveProfile(profile);

    return { profile, points, xpGain, leveledUp, newBadges };
}
