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

    if (!profile.badges.some((b) => b.id === "first-task")) {
        newBadges.push({
            id: "first-task",
            title: "Primeiro Passo",
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
            title: "Uma Semana Incrível",
            description: "Concluiu tarefas por 7 dias consecutivos",
            awardedAt: new Date().toISOString(),
        });
    }

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

    if (!profile.badges.some((b) => b.id === "level-5") && profile.level >= 5) {
        newBadges.push({
            id: "level-5",
            title: "Ascensão",
            description: "Atingiu o nível 5",
            awardedAt: new Date().toISOString(),
        });
    }

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

    // Obtém recompensas base configuradas para a tag da tarefa
    // Estes valores são pré-configurados e não mudam por conclusão
    const tagRewards = getTagRewards(task.selectedTag);
    const basePoints = tagRewards.basePoints;
    const baseXP = tagRewards.baseXP;

    // Calcula streak: verifica se completado hoje, ontem, ou há um intervalo
    // Isso previne exploração da conclusão no mesmo dia para bônus extras
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
        else if (last === today) newStreak = profile.streak;
    }

    // Calcula bonus baseado na streak
    const streakBonus = Math.min(newStreak, 7) * 2;
    const points = basePoints + streakBonus;
    const xpGain = baseXP + Math.floor(streakBonus * 0.5);

    // Atualiza perfil com estatísticas
    profile.points = (profile.points ?? 0) + points;
    profile.coins = (profile.coins ?? 0) + Math.floor(points / 5);
    profile.xp = (profile.xp ?? 0) + xpGain;

    // Trata progressão de nível: XP "excedente" vai para o próximo nível
    let leveledUp = false;
    while (profile.xp >= requiredXpForLevel(profile.level + 1)) {
        profile.xp -= requiredXpForLevel(profile.level + 1);
        profile.level += 1;
        leveledUp = true;
    }

    // Atualiza streak
    profile.streak = newStreak;
    profile.lastCompletionDate = today;

    // Checa se tem bagdges
    const newBadges = checkBadges(profile);
    if (newBadges.length) {
        profile.badges = [...(profile.badges ?? []), ...newBadges];
    }

    await saveProfile(profile);

    return { profile, points, xpGain, leveledUp, newBadges };
}
