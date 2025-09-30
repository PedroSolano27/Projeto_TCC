// Implementação do AsyncStorage

// Tipos
import { Task } from "../types/Task";

//Terceiros
import AsyncStorage from "@react-native-async-storage/async-storage";

export function TaskStorage() {
    const STORAGE_KEY = "@tasks_v1";

    // Pega todas as tarefas
    async function getAllTasks() {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        return raw ? (JSON.parse(raw) as Task[]) : [];
    }

    // Salva tarefas
    async function saveAllTasks(tasks: Task[]) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    // Adiciona tarefas
    async function addTask(task: Task) {
        const tasks = await getAllTasks();
        tasks.unshift(task);

        await saveAllTasks(tasks);
    }

    // Atualiza Tarefas
    async function updateTask(updated: Task) {
        const tasks = await getAllTasks();

        const idx = tasks.findIndex((t) => t.id === updated.id);
        if (idx >= 0) {
            tasks[idx] = updated;
            await saveAllTasks(tasks);
        }
    }

    // Remove Tarefas
    async function removeTask(id: string): Promise<void> {
        const tasks = await getAllTasks();
        const filtered = tasks.filter((t) => t.id !== id);

        await saveAllTasks(filtered);
    }

    return {
        getAllTasks,
        saveAllTasks,
        addTask,
        updateTask,
        removeTask,
    };
}
