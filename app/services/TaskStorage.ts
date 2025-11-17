import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "events";
import * as Notifications from "expo-notifications";
import { Task } from "../types/Task";
import { applyCompletionRewards } from "./Gamification";
import {
    notifyBadgeUnlocked,
    notifyLevelUp,
    notifyStreakMilestone,
} from "./MotivationalNotifications";

export const gamificationEvents = new EventEmitter();

const NOTIFICATION_HOURS = {
    "1h": 1,
    "2h": 2,
    "4h": 4,
    "8h": 8,
    "12h": 12,
    "24h": 24,
};

export function TaskStorage() {
    const STORAGE_KEY = "@tasks_v1";

    async function getAllTasks() {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Task[]) : [];
    }

    async function saveAllTasks(tasks: Task[]) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    async function addTask(task: Task) {
        const tasks = await getAllTasks();
        // Agenda notificações
        await scheduleReminders(task);
        const withNotifications = {
            ...task,
            notificationIds:
                task.notificationIds && task.notificationIds.length > 0
                    ? task.notificationIds
                    : undefined,
        };
        tasks.unshift(withNotifications);
        await saveAllTasks(tasks);
    }

    async function completeTask(taskId: string) {
        const tasks = await getAllTasks();
        const idx = tasks.findIndex((t) => t.id === taskId);
        if (idx === -1) return;

        const original = tasks[idx];
        if (original.completed) return;

        const updated: Task = {
            ...original,
            completed: true,
            completedAt: new Date().toISOString(),
        };

        if (original.notificationIds) {
            for (const id of original.notificationIds) {
                await cancelReminder(id);
            }
        }

        tasks[idx] = updated;
        await saveAllTasks(tasks);

        try {
            const result = await applyCompletionRewards(updated);
            if (result?.leveledUp) {
                gamificationEvents.emit("levelup", {
                    level: result.profile.level,
                    coins: result.profile.coins,
                });
                await notifyLevelUp(result.profile.level, result.profile.coins);
            }
            if (result?.points) {
                gamificationEvents.emit("pointsEarned", {
                    points: result.points,
                    xp: result.xpGain,
                });
            }
            if (result?.newBadges && result.newBadges.length > 0) {
                for (const badge of result.newBadges) {
                    await notifyBadgeUnlocked(badge.title, badge.description);
                }
            }
            if (result?.profile.streak === 7 || result?.profile.streak === 30) {
                await notifyStreakMilestone(result.profile.streak);
            }
        } catch {
            // Ignora erros silenciosamente
        }
    }

    async function updateTask(updated: Task) {
        const tasks = await getAllTasks();
        const idx = tasks.findIndex((t) => t.id === updated.id);

        // Cancela notificações agendadas de forma iterativa pelo histórico de tarefas
        if (idx !== -1 && tasks[idx]) {
            if (
                tasks[idx].notificationIds &&
                Array.isArray(tasks[idx].notificationIds)
            ) {
                for (const id of tasks[idx].notificationIds) {
                    await cancelReminder(id);
                }
            }
        }

        // Sempre reagenda notificações se tarefa não está completa
        let notificationIds: string[] | undefined;
        if (
            !updated.completed &&
            updated.notificationIds &&
            updated.notificationIds.length > 0
        ) {
            // Agenda lembretes com base nas seleções de tempo do formulário
            await scheduleReminders(updated);
            notificationIds = updated.notificationIds;
        }

        const newTask = { ...updated, notificationIds };

        if (idx !== -1) {
            const wasCompleted = tasks[idx].completed;
            tasks[idx] = newTask;
            await saveAllTasks(tasks);

            if (!wasCompleted && newTask.completed) {
                try {
                    // Aplica recompensas
                    const result = await applyCompletionRewards(newTask);
                    if (result?.leveledUp) {
                        gamificationEvents.emit("levelup", {
                            level: result.profile.level,
                            coins: result.profile.coins,
                        });
                        await notifyLevelUp(
                            result.profile.level,
                            result.profile.coins,
                        );
                    }
                    if (result?.points) {
                        gamificationEvents.emit("pointsEarned", {
                            points: result.points,
                            xp: result.xpGain,
                        });
                    }
                    if (result?.newBadges && result.newBadges.length > 0) {
                        for (const badge of result.newBadges) {
                            await notifyBadgeUnlocked(
                                badge.title,
                                badge.description,
                            );
                        }
                    }
                    if (
                        result?.profile.streak === 7 ||
                        result?.profile.streak === 30
                    ) {
                        await notifyStreakMilestone(result.profile.streak);
                    }
                } catch {
                    // Ignora erros silenciosamente
                }
            }
        } else {
            tasks.unshift(newTask);
            await saveAllTasks(tasks);
        }
    }

    async function removeTask(id: string) {
        const tasks = await getAllTasks();
        const found = tasks.find((t) => t.id === id);

        if (found && found.notificationIds) {
            for (const notificationId of found.notificationIds) {
                await cancelReminder(notificationId);
            }
        }

        const filtered = tasks.filter((t) => t.id !== id);
        await saveAllTasks(filtered);
    }

    async function scheduleReminders(task: Task): Promise<string[]> {
        const notificationIds: string[] = [];

        try {
            // Validação para agendamento
            if (!task.dueDate || task.completed || !task.notificationIds) {
                return [];
            }

            const due = new Date(task.dueDate);
            const now = new Date();
            const diffMs = due.getTime() - now.getTime();

            // Só agenda se  a entrega for dentro de 7 dias
            if (diffMs <= 0 || diffMs > 1000 * 60 * 60 * 24 * 7) {
                return [];
            }

            // Agenda notificação para cada tempo selecionado
            // Tempos mapeiam para horas antes do vencimento (ex: \"1h\" = 1 hora antes)
            for (const timeId of task.notificationIds) {
                const hours =
                    NOTIFICATION_HOURS[
                        timeId as keyof typeof NOTIFICATION_HOURS
                    ];
                if (!hours) continue; // Pula identificadores de tempo desconhecidos

                // Calcula data de acionamento: vencimento menos as horas selecionadas
                const offsetMs = hours * 60 * 60 * 1000;
                const triggerDate = new Date(
                    Math.max(
                        due.getTime() - offsetMs,
                        now.getTime() + 1000 * 60, // Garante pelo menos 1 minuto no futuro
                    ),
                );

                // Agenda somente se o acionamento estiver no futuro
                if (triggerDate.getTime() <= now.getTime()) {
                    continue;
                }

                try {
                    const id = await Notifications.scheduleNotificationAsync({
                        content: {
                            title: "Tarefa próxima do vencimento",
                            body: `${task.title}`,
                            data: { taskId: task.id },
                            sound: true,
                        },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes
                                .DATE,
                            date: triggerDate,
                        },
                    });
                    notificationIds.push(id);
                } catch (err) {
                    console.warn(
                        `Erro ao agendar notificação para ${timeId}:`,
                        err,
                    );
                    // Continua com o próximo tempo de notificação se este falhar
                }
            }
        } catch (err) {
            console.warn("Erro ao agendar lembretes:", err);
            // Retorna quaisquer notificações agendadas com sucesso
        }

        return notificationIds;
    }

    async function cancelReminder(notificationId: string) {
        try {
            await Notifications.cancelScheduledNotificationAsync(
                notificationId,
            );
        } catch {
            // Ignora erros silenciosamente
        }
    }

    return {
        getAllTasks,
        saveAllTasks,
        addTask,
        updateTask,
        removeTask,
        scheduleReminders,
        cancelReminder,
        completeTask,
    };
}
