/* eslint-disable react-hooks/exhaustive-deps */
// Tela de Lista de Tarefas

// Tipos
import { RootStackParamList } from "../types/StackParamList";
import { Task } from "../types/Task";

// Terceiros
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { TaskStorage } from "../services/TaskStorage";

// Elementos
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import TaskItem from "../components/TaskItem";

type Props = NativeStackScreenProps<RootStackParamList, "List">;

export default function TaskListScreen({ navigation }: Props) {
    const { getAllTasks, updateTask, removeTask } = TaskStorage();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<"all" | "completed" | "pending">(
        "completed",
    );

    // Filtra as tarefas
    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true; // 'all'
    });

    // Carrega tarefas
    async function load() {
        const all = await getAllTasks();
        setTasks(all);
    }

    // Atualiza estado de uma tarefa
    async function toggle(id: string) {
        const t = tasks.find((x) => x.id === id);
        if (!t) return;

        const updated = { ...t, completed: !t.completed };
        await updateTask(updated);

        load();
    }

    // Remove uma tarefa
    async function del(id: string) {
        Alert.alert(
            "Confirmar",
            "Tem certeza que deseja excluir esta tarefa?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        await removeTask(id);
                        load();
                    },
                },
            ],
            { cancelable: true },
        );
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", load);
        load();

        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Minhas Tarefas</Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Form")}
                    style={styles.addBtn}
                >
                    <Text style={styles.addText}>+ Nova</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity
                    onPress={() => setFilter("all")}
                    style={[
                        styles.filterBtn,
                        filter === "all" && styles.filterActive,
                    ]}
                >
                    <Text style={styles.filterText}>Todas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setFilter("pending")}
                    style={[
                        styles.filterBtn,
                        filter === "pending" && styles.filterActive,
                    ]}
                >
                    <Text style={styles.filterText}>Pendentes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setFilter("completed")}
                    style={[
                        styles.filterBtn,
                        filter === "completed" && styles.filterActive,
                    ]}
                >
                    <Text style={styles.filterText}>Concluídas</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskItem
                        task={item}
                        onToggle={toggle}
                        onEdit={(task) => navigation.navigate("Form", { task })}
                        onDelete={del}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>Nenhuma tarefa cadastrada</Text>
                }
            />
        </View>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 40, paddingHorizontal: 16 },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    title: { fontSize: 24, fontWeight: "600" },
    addBtn: {
        backgroundColor: "#0984e3",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    filterBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: "#eee",
    },
    addText: { color: "#fff", fontWeight: "600" },
    filterText: {
        color: "#333",
        fontWeight: "500",
    },
    empty: { textAlign: "center", marginTop: 40, color: "#666" },
    filterActive: {
        backgroundColor: "#0984e3",
    },
});
