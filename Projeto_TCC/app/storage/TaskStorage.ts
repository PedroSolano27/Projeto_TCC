// Implementação do AsyncStorage

// Tipos
import { Task } from "../types/Task";

// Terceiros
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@tasks";

export async function getTasks(): Promise<Task[]> {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error("Erro ao carregar tarefas", e);
        return [];
    }
}

export async function saveTasks(tasks: Task[]) {
    try {
        const jsonValue = JSON.stringify(tasks);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error("Erro ao salvar tarefas", e);
    }
}
