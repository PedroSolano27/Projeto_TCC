// Tela de Tarefas

// Tipos
import { Task } from "../types/Task";

// Terceiros
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { getTasks, saveTasks } from "../storage/TaskStorage";

// Elementos
import TaskItem from "../components/TaskItem";

export default function TaskScreen() {
    const [input, setInput] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        loadTasks();
    }, []);

    async function loadTasks() {
        const saved = await getTasks();
        setTasks(saved);
    }

    async function addTask() {
        if (!input.trim()) return;
        const newTask: Task = { id: uuidv4(), title: input, done: false };
        const updated = [...tasks, newTask];
        setTasks(updated);
        await saveTasks(updated);
        setInput("");
    }

    async function toggleTask(id: string) {
        const updated = tasks.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t,
        );
        setTasks(updated);
        await saveTasks(updated);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Minhas Tarefas</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite uma tarefa..."
                    value={input}
                    onChangeText={setInput}
                />
                <Button title="Adicionar" onPress={addTask} />
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskItem task={item} onToggle={toggleTask} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
    row: { flexDirection: "row", marginBottom: 12 },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginRight: 8,
        borderRadius: 6,
    },
});
