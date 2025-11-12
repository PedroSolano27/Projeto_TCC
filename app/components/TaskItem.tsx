import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { getTagRewards } from "../config/tags";
import { useSettings } from "../context/SettingsContext";
import { createStyles } from "../styles/ScreenStyles";
import { Task } from "../types/Task";
import { Badge } from "./Badge";

type Props = {
    task: Task;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
};

export default function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
    const { theme } = useSettings();
    const { TaskStyles } = createStyles(theme);
    const tagRewards = getTagRewards(task.selectedTag);

    // Format due date
    const formatDueDate = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        if (isToday) return "Hoje";
        if (isTomorrow) return "Amanhã";
        return date.toLocaleDateString("pt-BR", {
            month: "short",
            day: "numeric",
        });
    };

    const dueDate = formatDueDate(task.dueDate);
    const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
    const isOverdue = dueDateObj && dueDateObj < new Date() && !task.completed;

    return (
        <View
            style={TaskStyles.container}
            accessible={true}
            accessibilityLabel={`Tarefa: ${task.title}`}
            accessibilityState={{ checked: task.completed }}
            accessibilityHint="Toque para marcar como concluído"
        >
            {/* Left Section - Checkbox and Content */}
            <TouchableOpacity
                onPress={() => onToggle(task.id)}
                style={TaskStyles.left}
                activeOpacity={0.7}
                accessibilityRole="checkbox"
            >
                {/* Checkbox */}
                <View
                    style={[
                        TaskStyles.checkbox,
                        task.completed && TaskStyles.checked,
                    ]}
                >
                    {task.completed && (
                        <Text style={TaskStyles.checkmark}>✓</Text>
                    )}
                </View>

                {/* Task Content */}
                <View style={TaskStyles.meta}>
                    <Text
                        style={[
                            TaskStyles.title,
                            task.completed && TaskStyles.titleCompleted,
                        ]}
                        numberOfLines={2}
                    >
                        {task.title}
                    </Text>

                    {/* Due Date */}
                    {dueDate && (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 4,
                            }}
                        >
                            <Feather
                                name="calendar"
                                size={12}
                                color={isOverdue ? "#ef4444" : "#9CA3AF"}
                                style={{ marginRight: 4 }}
                            />
                            <Text
                                style={[
                                    TaskStyles.due,
                                    isOverdue && {
                                        color: "#ef4444",
                                        fontWeight: "600",
                                    },
                                ]}
                            >
                                {dueDate}
                                {isOverdue && " (vencida)"}
                            </Text>
                        </View>
                    )}

                    {/* Tag Badge */}
                    {tagRewards && (
                        <View style={{ marginTop: 6 }}>
                            <Badge
                                label={`${tagRewards.label} • +${tagRewards.baseXP} XP`}
                                theme={theme}
                                variant="primary"
                                size="small"
                            />
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            {/* Right Section - Actions */}
            <View style={TaskStyles.actions}>
                <TouchableOpacity
                    onPress={() => onEdit(task)}
                    style={TaskStyles.actionBtn}
                    accessibilityLabel="Editar tarefa"
                    accessibilityRole="button"
                >
                    <Feather name="edit-2" size={18} color="#3B82F6" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onDelete(task.id)}
                    style={TaskStyles.actionBtn}
                    accessibilityLabel="Deletar tarefa"
                    accessibilityRole="button"
                >
                    <Feather name="trash-2" size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
