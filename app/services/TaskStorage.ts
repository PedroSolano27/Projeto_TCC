// Implementação do AsyncStorage

// Tipos
import { Task } from "../types/Task";

//Terceiros
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "events";
import * as Notifications from "expo-notifications";
import { useSettings } from "../context/SettingsContext";
import { applyCompletionRewards } from "./Gamification";

export const gamificationEvents = new EventEmitter();

export function TaskStorage() {
    const STORAGE_KEY = "@tasks_v1";

    const { defaultReminderMinutes } = useSettings();

    // Pega todas as tarefas
    async function getAllTasks() {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        return raw ? (JSON.parse(raw) as Task[]) : [];
    }

    // Salva tarefas
    async function saveAllTasks(tasks: Task[]) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    // Adiciona Tarefa
    async function addTask(task: Task) {
        const tasks = await getAllTasks();

        // Agenda notificação e armazena id na tarefa
        const notificationId = await scheduleReminder(task);
        const withNotification = {
            ...task,
            notificationId: notificationId ?? null,
        };

        tasks.unshift(withNotification);
        await saveAllTasks(tasks);
    }

    // Marca como concluída (helper)
    async function completeTask(taskId: string) {
        const tasks = await getAllTasks();
        const idx = tasks.findIndex((t) => t.id === taskId);
        if (idx === -1) return;

        const original = tasks[idx];
        if (original.completed) return; // já concluída

        const updated: Task = {
            ...original,
            completed: true,
            completedAt: new Date().toISOString(),
        };

        // Cancela notificação se houver
        if (original.notificationId) {
            await cancelReminder(original.notificationId);
        }

        // Persiste mudança
        tasks[idx] = updated;
        await saveAllTasks(tasks);

        // Aplica recompensas de gamificação
        try {
            const result = await applyCompletionRewards(updated);
            if (result?.leveledUp) {
                gamificationEvents.emit("levelup", {
                    level: result.profile.level,
                    coins: result.profile.coins,
                });
            }
            if (result?.points) {
                gamificationEvents.emit("pointsEarned", {
                    points: result.points,
                    xp: result.xpGain,
                });
            }
        } catch (err) {
            console.warn("Erro ao aplicar recompensas", err);
        }
    }

    // Atualiza Tarefa
    async function updateTask(updated: Task) {
        const tasks = await getAllTasks();
        const idx = tasks.findIndex((t) => t.id === updated.id);

        // Cancela notificação anterior se existir
        if (idx !== -1 && tasks[idx].notificationId) {
            await cancelReminder(tasks[idx].notificationId);
        }

        // (re)agenda se aplicável (somente se não estiver concluída)
        let notificationId = null;
        if (!updated.completed) {
            notificationId = await scheduleReminder(updated);
        }

        const newTask = { ...updated, notificationId: notificationId ?? null };

        if (idx !== -1) {
            const wasCompleted = tasks[idx].completed;
            tasks[idx] = newTask;
            await saveAllTasks(tasks);

            // Se passou de não concluída para concluída via updateTask, aplicar recompensas
            if (!wasCompleted && newTask.completed) {
                try {
                    const result = await applyCompletionRewards(newTask);
                    if (result?.leveledUp) {
                        gamificationEvents.emit("levelup", {
                            level: result.profile.level,
                            coins: result.profile.coins,
                        });
                    }
                    if (result?.points) {
                        gamificationEvents.emit("pointsEarned", {
                            points: result.points,
                            xp: result.xpGain,
                        });
                    }
                } catch (err) {
                    console.warn("Erro ao aplicar recompensas", err);
                }
            }
        } else {
            // inserir nova
            tasks.unshift(newTask);
            await saveAllTasks(tasks);
        }
    }

    // Remove Tarefa
    async function removeTask(id: string) {
        const tasks = await getAllTasks();

        const found = tasks.find((t) => t.id === id);
        if (found && found.notificationId) {
            await cancelReminder(found.notificationId);
        }

        const filtered = tasks.filter((t) => t.id !== id);
        await saveAllTasks(filtered);
    }

    // Envia notificação
    async function scheduleReminder(task: Task) {
        try {
            if (!task.dueDate || task.completed) return null;

            const due = new Date(task.dueDate);
            const now = new Date();
            const diffMs = due.getTime() - now.getTime();

            // Só agenda se ainda não passou e estiver dentro de 7 dias
            if (diffMs <= 0 || diffMs > 1000 * 60 * 60 * 24 * 7) return null;

            // Usa o valor defaultReminderMinutes
            const offsetMs =
                defaultReminderMinutes !== null
                    ? defaultReminderMinutes * 60 * 1000
                    : 60 * 60 * 1000; // fallback: 1h

            const triggerDate = new Date(
                Math.max(due.getTime() - offsetMs, now.getTime() + 1000 * 10),
            );

            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Tarefa próxima do vencimento",
                    body: `${task.title}`,
                    data: { taskId: task.id },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: triggerDate,
                },
            });

            return id;
        } catch (err) {
            console.warn("Erro ao agendar notificação", err);
            return null;
        }
    }

    // Concela Notificação
    async function cancelReminder(notificationId?: string | null) {
        if (notificationId) {
            try {
                await Notifications.cancelScheduledNotificationAsync(
                    notificationId,
                );
            } catch (err) {
                console.warn("Erro ao cancelar notificação", err);
            }
        }
    }

    return {
        getAllTasks,
        saveAllTasks,
        addTask,
        updateTask,
        removeTask,
        scheduleReminder,
        cancelReminder,
        completeTask,
    };
}
