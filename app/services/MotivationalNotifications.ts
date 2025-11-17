import * as Notifications from "expo-notifications";

const motivationalMessages = [
    {
        title: "Você está indo bem! 🌟",
        body: "Continue completando tarefas e desbloqueando conquistas.",
    },
    {
        title: "Consecutivo incrível! 🔥",
        body: "Seu streaks está alto, mantenha a consistência!",
    },
    {
        title: "Parabéns pelo progresso! 🎉",
        body: "Você subiu de nível! Continue assim.",
    },
    {
        title: "Tempo de ser produtivo! ⏰",
        body: "Você tem tarefas pendentes. Vamos começar?",
    },
    {
        title: "Quase lá! 💪",
        body: "Apenas uma tarefa a mais para melhorar seu dia.",
    },
    {
        title: "Bom trabalho! ✅",
        body: "Mantenha essa energia positiva!",
    },
    {
        title: "Você é incrível! 🚀",
        body: "Continue perseguindo seus objetivos.",
    },
    {
        title: "Apenas mais um? 📋",
        body: "Mais uma tarefa para completar sua meta de hoje.",
    },
];

export async function scheduleMotivationalNotification(
    hoursFromNow: number = 24,
) {
    try {
        const message =
            motivationalMessages[
                Math.floor(Math.random() * motivationalMessages.length)
            ];

        const triggerDate = new Date();
        triggerDate.setHours(triggerDate.getHours() + hoursFromNow);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: message.title,
                body: message.body,
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
            },
        });
    } catch (err) {
        console.warn("Erro ao agendar notificação motivacional", err);
    }
}

export async function sendGamificationNotification(
    title: string,
    body: string,
    delay: number = 0,
) {
    try {
        const triggerDate = new Date();
        triggerDate.setSeconds(triggerDate.getSeconds() + (delay ?? 1));

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
            },
        });
    } catch (err) {
        console.warn("Erro ao enviar notificação de gamificação", err);
    }
}

export async function notifyLevelUp(level: number, coins: number) {
    await sendGamificationNotification(
        `🎉 Parabéns! Você subiu para o Nível ${level}!`,
        `Recebeu ${coins} moedas como recompensa!`,
    );
}

export async function notifyBadgeUnlocked(
    badgeTitle: string,
    badgeDescription: string,
) {
    await sendGamificationNotification(
        `🏆 Nova Conquista Desbloqueada!`,
        `${badgeTitle}: ${badgeDescription}`,
    );
}

export async function notifyStreakMilestone(streak: number) {
    const message =
        streak === 7
            ? "Uma semana incrível!"
            : `${streak} dias de consistência!`;
    await sendGamificationNotification(`🔥 Streak Milestone!`, message);
}
