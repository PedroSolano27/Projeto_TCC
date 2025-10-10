/* eslint-disable react-hooks/exhaustive-deps */
// Tela de Lista de Tarefas

// Tipos
import { RootStackParamList } from "../types/StackParamList";
import { Task } from "../types/Task";

// Terceiros
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { TaskStorage } from "../services/TaskStorage";
import { createStyles } from "../styles/ScreenStyles";

// Elementos
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import TaskItem from "../components/TaskItem";

type Props = NativeStackScreenProps<RootStackParamList, "List">;

export default function TaskListScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const { getAllTasks, updateTask, removeTask } = TaskStorage();
    const { TaskListStyles } = createStyles(theme);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<"all" | "completed" | "pending">(
        "pending",
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

        if (updated.completed && t.notificationId) {
            // Cancela notificação
            await Notifications.cancelScheduledNotificationAsync(
                t.notificationId,
            );
            updated.notificationId = null;
        }

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
        <View style={TaskListStyles.container}>
            <View style={TaskListStyles.header}>
                <Text style={TaskListStyles.title}>Minhas Tarefas</Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Settings")}
                    style={TaskListStyles.addBtn}
                >
                    <Text style={TaskListStyles.addText}>Opções</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Form")}
                    style={TaskListStyles.addBtn}
                >
                    <Text style={TaskListStyles.addText}>+ Nova</Text>
                </TouchableOpacity>
            </View>

            <View style={TaskListStyles.filterContainer}>
                <TouchableOpacity
                    onPress={() => setFilter("all")}
                    style={[
                        TaskListStyles.filterBtn,
                        filter === "all" && TaskListStyles.filterActive,
                    ]}
                >
                    <Text style={TaskListStyles.filterText}>Todas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setFilter("pending")}
                    style={[
                        TaskListStyles.filterBtn,
                        filter === "pending" && TaskListStyles.filterActive,
                    ]}
                >
                    <Text style={TaskListStyles.filterText}>Pendentes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setFilter("completed")}
                    style={[
                        TaskListStyles.filterBtn,
                        filter === "completed" && TaskListStyles.filterActive,
                    ]}
                >
                    <Text style={TaskListStyles.filterText}>Concluídas</Text>
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
                    <Text style={TaskListStyles.empty}>
                        Nenhuma tarefa cadastrada
                    </Text>
                }
            />
        </View>
    );
}
