import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import TaskItem from "../components/TaskItem";
import { useSettings } from "../context/SettingsContext";
import { TaskStorage } from "../services/TaskStorage";
import { createStyles } from "../styles/ScreenStyles";
import { RootStackParamList } from "../types/StackParamList";
import { Task } from "../types/Task";

type Props = NativeStackScreenProps<RootStackParamList, "List">;
type FilterType = "all" | "completed" | "pending" | "inProgress";

export default function TaskListScreen({ navigation }: Props) {
    const { theme, taskFilter } = useSettings();
    const { getAllTasks, updateTask, removeTask } = TaskStorage();
    const { TaskListStyles } = createStyles(theme);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<FilterType>("all");

    // Aplica filtro
    const filteredTasks = tasks.filter((task) => {
        switch (filter) {
            case "completed":
                return task.completed;
            case "pending":
                return !task.completed;
            case "inProgress":
                return !task.completed;
            default:
                return true;
        }
    });

    // Calcula stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = tasks.filter((t) => !t.completed).length;

    const loadTasks = useCallback(async () => {
        const allTasks = await getAllTasks();
        setTasks(allTasks);
    }, [getAllTasks]);

    const toggleTask = async (id: string) => {
        const task = tasks.find((x) => x.id === id);
        if (!task) return;

        const updated = { ...task, completed: !task.completed };

        if (updated.completed && task.notificationIds) {
            for (const notId of task.notificationIds) {
                try {
                    await Notifications.cancelScheduledNotificationAsync(notId);
                } catch {
                    continue;
                }
            }
            updated.notificationIds = undefined;
        }

        await updateTask(updated);
        loadTasks();
    };

    const deleteTask = (id: string) => {
        Alert.alert(
            "Confirmar exclusão",
            "Tem certeza que deseja excluir esta tarefa?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        await removeTask(id);
                        loadTasks();
                    },
                },
            ],
            { cancelable: true },
        );
    };

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", loadTasks);
        return unsubscribe;
    }, [navigation, loadTasks]);

    useEffect(() => {
        setFilter(taskFilter as FilterType);
    }, [taskFilter]);

    const getFilterIcon = (filterType: FilterType) => {
        const iconMap = {
            all: "list",
            pending: "clock",
            completed: "check-circle",
            inProgress: "activity",
        };
        return iconMap[filterType];
    };

    const getFilterLabel = (filterType: FilterType) => {
        const labelMap = {
            all: "Todas",
            pending: "Pendentes",
            completed: "Concluídas",
            inProgress: "Em Progresso",
        };
        return labelMap[filterType];
    };

    return (
        <View style={TaskListStyles.container}>
            <View style={TaskListStyles.header}>
                <View>
                    <Text style={TaskListStyles.title}>Minhas Tarefas</Text>
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Dashboard")}
                        style={TaskListStyles.headerButton}
                        accessibilityLabel="Progresso"
                        accessibilityHint="Navegue para a tela de progresso e gamificação"
                    >
                        <Feather name="bar-chart-2" size={18} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Settings")}
                        style={TaskListStyles.headerButton}
                        accessibilityLabel="Opções"
                        accessibilityHint="Navegue para as configurações"
                    >
                        <Feather name="settings" size={18} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Form")}
                        style={TaskListStyles.headerButton}
                        accessibilityLabel="Nova tarefa"
                        accessibilityHint="Crie uma nova tarefa"
                    >
                        <Feather name="plus" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {totalTasks > 0 && (
                <View
                    style={{
                        flexDirection: "row",
                        gap: 12,
                        marginBottom: 16,
                        paddingHorizontal: 4,
                    }}
                >
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text
                            style={{
                                fontSize: 12,
                                color: "#999",
                                marginBottom: 4,
                            }}
                        >
                            Total
                        </Text>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                color: "#0984e3",
                            }}
                        >
                            {totalTasks}
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text
                            style={{
                                fontSize: 12,
                                color: "#999",
                                marginBottom: 4,
                            }}
                        >
                            Pendentes
                        </Text>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                color: "#f59e0b",
                            }}
                        >
                            {pendingTasks}
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text
                            style={{
                                fontSize: 12,
                                color: "#999",
                                marginBottom: 4,
                            }}
                        >
                            Concluídas
                        </Text>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                color: "#27ae60",
                            }}
                        >
                            {completedTasks}
                        </Text>
                    </View>
                </View>
            )}

            <View style={TaskListStyles.filterContainer}>
                {(["all", "pending", "completed"] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        onPress={() => setFilter(f)}
                        style={[
                            TaskListStyles.filterBtn,
                            filter === f && TaskListStyles.filterBtnActive,
                        ]}
                        accessibilityLabel={getFilterLabel(f)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: filter === f }}
                    >
                        <Feather
                            name={getFilterIcon(f) as any}
                            size={16}
                            color={filter === f ? "#FFFFFF" : "#6B7280"}
                            style={{ marginRight: 6 }}
                        />
                        <Text
                            style={[
                                TaskListStyles.filterText,
                                filter === f && TaskListStyles.filterTextActive,
                            ]}
                        >
                            {getFilterLabel(f)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskItem
                        task={item}
                        onToggle={toggleTask}
                        onEdit={(task) => navigation.navigate("Form", { task })}
                        onDelete={deleteTask}
                    />
                )}
                contentContainerStyle={TaskListStyles.listContent}
                ListEmptyComponent={
                    <View style={{ alignItems: "center", marginTop: 60 }}>
                        <Feather
                            name="inbox"
                            size={64}
                            color="#ccc"
                            style={{ marginBottom: 16 }}
                        />
                        <Text style={TaskListStyles.empty}>
                            {filter === "completed"
                                ? "Nenhuma tarefa concluída"
                                : filter === "pending"
                                  ? "Nenhuma tarefa pendente"
                                  : "Nenhuma tarefa cadastrada"}
                        </Text>
                        <Text
                            style={{
                                marginTop: 8,
                                color: "#999",
                                fontSize: 14,
                                paddingHorizontal: 20,
                                textAlign: "center",
                            }}
                        >
                            {filter === "all" &&
                                "Comece criando uma nova tarefa"}
                        </Text>
                    </View>
                }
            />
        </View>
    );
}
