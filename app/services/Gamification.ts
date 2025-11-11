import { getTagRewards } from "../config/tags";
import { Badge } from "../types/GamificationTypes";
import { Task } from "../types/Task";
import {
    loadProfile,
    requiredXpForLevel,
    saveProfile,
} from "./UserProfileStorage";

function todayString() {
    return new Date().toISOString().slice(0, 10);
}

function checkBadges(profile: {
    badges: Badge[];
    streak: number;
    level: number;
    points: number;
}): Badge[] {
    const newBadges: Badge[] = [];

    // First Task Badge: Unlocks on first task completion
    if (!profile.badges.some((b) => b.id === "first-task")) {
        newBadges.push({
            id: "first-task",
            title: "Primeiro Passo",
            description: "Concluiu a primeira tarefa",
            awardedAt: new Date().toISOString(),
        });
    }

    // Streak Milestone: 7 consecutive days
    if (
        !profile.badges.some((b) => b.id === "7-day-streak") &&
        profile.streak >= 7
    ) {
        newBadges.push({
            id: "7-day-streak",
            title: "Uma Semana Incrível",
            description: "Concluiu tarefas por 7 dias consecutivos",
            awardedAt: new Date().toISOString(),
        });
    }

    // Streak Milestone: 30 consecutive days
    if (
        !profile.badges.some((b) => b.id === "30-day-streak") &&
        profile.streak >= 30
    ) {
        newBadges.push({
            id: "30-day-streak",
            title: "Um Mês de Consistência",
            description: "Concluiu tarefas por 30 dias consecutivos",
            awardedAt: new Date().toISOString(),
        });
    }

    // Level Milestone: Reached level 5
    if (!profile.badges.some((b) => b.id === "level-5") && profile.level >= 5) {
        newBadges.push({
            id: "level-5",
            title: "Ascensão",
            description: "Atingiu o nível 5",
            awardedAt: new Date().toISOString(),
        });
    }

    // Level Milestone: Reached level 10
    if (
        !profile.badges.some((b) => b.id === "level-10") &&
        profile.level >= 10
    ) {
        newBadges.push({
            id: "level-10",
            title: "Mestre",
            description: "Atingiu o nível 10",
            awardedAt: new Date().toISOString(),
        });
    }

    // Level Milestone: Reached level 20 (high-level achievement)
    if (
        !profile.badges.some((b) => b.id === "level-20") &&
        profile.level >= 20
    ) {
        newBadges.push({
            id: "level-20",
            title: "Lenda",
            description: "Atingiu o nível 20",
            awardedAt: new Date().toISOString(),
        });
    }

    // Points Milestone: Accumulated 100 points
    if (
        !profile.badges.some((b) => b.id === "100-points") &&
        profile.points >= 100
    ) {
        newBadges.push({
            id: "100-points",
            title: "Centenário",
            description: "Acumulou 100 pontos",
            awardedAt: new Date().toISOString(),
        });
    }

    // Points Milestone: Accumulated 500 points
    if (
        !profile.badges.some((b) => b.id === "500-points") &&
        profile.points >= 500
    ) {
        newBadges.push({
            id: "500-points",
            title: "Destaque",
            description: "Acumulou 500 pontos",
            awardedAt: new Date().toISOString(),
        });
    }

    // Points Milestone: Accumulated 1000 points (major achievement)
    if (
        !profile.badges.some((b) => b.id === "1000-points") &&
        profile.points >= 1000
    ) {
        newBadges.push({
            id: "1000-points",
            title: "Produtividade Extrema",
            description: "Acumulou 1000 pontos",
            awardedAt: new Date().toISOString(),
        });
    }

    return newBadges;
}

export async function applyCompletionRewards(task: Task) {
    const profile = await loadProfile();

    // Get base rewards configured for the selected task tag
    // These values are pre-configured and don't change per-completion
    const tagRewards = getTagRewards(task.selectedTag);
    const basePoints = tagRewards.basePoints;
    const baseXP = tagRewards.baseXP;

    // Calculate streak: checks if completed today, yesterday, or there's a gap
    // This prevents exploiting same-day completion for extra streak bonuses
    const last = profile.lastCompletionDate
        ? profile.lastCompletionDate.slice(0, 10) // Extract YYYY-MM-DD
        : null;

    const today = todayString(); // Get today as YYYY-MM-DD

    let newStreak = 1;

    if (last) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (last === yesterday.toISOString().slice(0, 10))
            // Yesterday's date matched: streak continues, increment
            newStreak = Math.min(profile.streak + 1, 365);
        else if (last === today)
            // Same day as last completion: maintain streak (don't exploit)
            newStreak = profile.streak;
        // else: gap in dates, newStreak stays at 1 (reset)
    }

    // Calculate bonus based on streak (capped at 7 days for balance)
    // Bonus multiplies both points and XP
    const streakBonus = Math.min(newStreak, 7) * 2;
    const points = basePoints + streakBonus;
    const xpGain = baseXP + Math.floor(streakBonus * 0.5);

    // Update profile with new statistics
    profile.points = (profile.points ?? 0) + points;
    profile.coins = (profile.coins ?? 0) + Math.floor(points / 5);
    profile.xp = (profile.xp ?? 0) + xpGain;

    // Handle level progression: XP "overflows" to next level
    // This loop handles multiple level-ups from single high-reward task
    let leveledUp = false;
    while (profile.xp >= requiredXpForLevel(profile.level + 1)) {
        profile.xp -= requiredXpForLevel(profile.level + 1);
        profile.level += 1;
        leveledUp = true;
    }

    // Update streak and completion date for next calculation
    profile.streak = newStreak;
    profile.lastCompletionDate = today;

    // Check if any new badges were unlocked by these changes
    const newBadges = checkBadges(profile);
    if (newBadges.length) {
        profile.badges = [...(profile.badges ?? []), ...newBadges];
    }

    // Persist all changes to storage
    await saveProfile(profile);

    return { profile, points, xpGain, leveledUp, newBadges };
}
