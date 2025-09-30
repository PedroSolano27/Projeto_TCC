// Componente de Tarefa

// Tipos
import { Task } from "../types/Task";

// Terceiros
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
    task: Task;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
};

export default function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => onToggle(task.id)}
                style={styles.left}
            >
                <View
                    style={[styles.checkbox, task.completed && styles.checked]}
                />

                <View style={styles.meta}>
                    <Text
                        style={[
                            styles.title,
                            task.completed && styles.completed,
                        ]}
                    >
                        {task.title}
                    </Text>

                    {task.dueDate ? (
                        <Text style={styles.due}>
                            {new Date(task.dueDate).toLocaleString()}
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>

            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={() => onEdit(task)}
                    style={styles.actionBtn}
                >
                    <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onDelete(task.id)}
                    style={styles.actionBtn}
                >
                    <Text style={[styles.actionText, { color: "#c0392b" }]}>
                        Excluir
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    left: { flexDirection: "row", alignItems: "center", flex: 1 },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#555",
        marginRight: 12,
    },
    checked: { backgroundColor: "#27ae60", borderColor: "#27ae60" },
    meta: { flex: 1 },
    title: { fontSize: 16, color: "#222" },
    completed: { textDecorationLine: "line-through", color: "#8e8e8e" },
    due: { fontSize: 12, color: "#666", marginTop: 4 },
    actions: { flexDirection: "row" },
    actionBtn: { marginLeft: 8, padding: 8 },
    actionText: { color: "#0984e3" },
});
