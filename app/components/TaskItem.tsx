// Componente de Tarefa

// Tipos
import { Task } from "../types/Task";

// Terceiros
import { Text, TouchableOpacity, View } from "react-native";
import { useSettings } from "../context/SettingsContext";
import { createStyles } from "../styles/ScreenStyles";

type Props = {
    task: Task;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
};

export default function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
    const { theme } = useSettings();
    const { TaskStyles } = createStyles(theme);

    return (
        <View style={TaskStyles.container}>
            <TouchableOpacity
                onPress={() => onToggle(task.id)}
                style={TaskStyles.left}
            >
                <View
                    style={[
                        TaskStyles.checkbox,
                        task.completed && TaskStyles.checked,
                    ]}
                />

                <View style={TaskStyles.meta}>
                    <Text
                        style={[
                            TaskStyles.title,
                            task.completed && TaskStyles.completed,
                        ]}
                    >
                        {task.title}
                    </Text>

                    {task.dueDate ? (
                        <Text style={TaskStyles.due}>
                            {new Date(task.dueDate).toLocaleString()}
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>

            <View style={TaskStyles.actions}>
                <TouchableOpacity
                    onPress={() => onEdit(task)}
                    style={TaskStyles.actionBtn}
                >
                    <Text style={TaskStyles.actionText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onDelete(task.id)}
                    style={TaskStyles.actionBtn}
                >
                    <Text style={[TaskStyles.actionText, { color: "#c0392b" }]}>
                        Excluir
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
