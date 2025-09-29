// Componente de Tarefa

// Tipos
import { Task } from "../types/Task";

// Terceiros
import { Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
    task: Task;
    onToggle: (id: string) => void;
};

export default function TaskItem({ task, onToggle }: Props) {
    return (
        <TouchableOpacity style={styles.item} onPress={() => onToggle(task.id)}>
            <Text style={[styles.text, task.done && styles.done]}>
                {task.title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 12,
        marginVertical: 6,
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
    },
    text: { fontSize: 16 },
    done: {
        textDecorationLine: "line-through",
        color: "gray",
    },
});
