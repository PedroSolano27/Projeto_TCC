// Tela de Formulário de Tarefas

// Tipos
import { RootStackParamList } from "../types/StackParamList";
import { Task } from "../types/Task";

// Terceiros
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskStorage } from "../services/TaskStorage";

// Elementos
import {
    Platform,
    StyleSheet,
    TextComponent,
    TextInputComponent,
    TouchableOpacity,
    ViewComponent,
} from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Form">;

export default function TaskFormScreen({ route, navigation }: Props) {
    const { addTask, updateTask } = TaskStorage();

    // Pega uma Task se ela já existe
    const existing = route.params?.task;

    const [title, setTitle] = useState(existing?.title || "");
    const [notes, setNotes] = useState(existing?.notes || "");
    const [dueDate, setDueDate] = useState(existing?.dueDate || "");

    // Cria uma tarefa nova ou salva uma editada
    async function save() {
        if (!title.trim()) return;

        // Atualiza se já existe
        if (existing) {
            const updated: Task = { ...existing, title, notes, dueDate };
            await updateTask(updated);

            navigation.goBack();
        }

        // Cria tarefa nova
        const newTask: Task = {
            id: uuidv4(),
            title,
            notes,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        await addTask(newTask);

        navigation.goBack();
    }

    // Mostra o título correto
    useEffect(() => {
        navigation.setOptions({
            title: existing ? "Editar Tarefa" : "Nova Tarefa",
        });
    }, [existing, navigation]);

    return (
        <ViewComponent style={styles.container}>
            <TextComponent style={styles.label}>Título</TextComponent>
            <TextInputComponent
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                placeholder="Ex: Estudar para Prova"
            />

            <TextComponent style={styles.label}>Notas</TextComponent>
            <TextInputComponent
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, { height: 80 }]}
                multiline
                placeholder="Detalhes..."
            />

            <TextComponent style={styles.label}>
                Data de Vencimento
            </TextComponent>
            <TextInputComponent
                value={dueDate}
                onChangeText={setDueDate}
                style={styles.input}
                placeholder="01/10/2025"
            />

            <TouchableOpacity onPress={save} style={styles.saveBtn}>
                <TextComponent style={styles.saveText}>Salvar</TextComponent>
            </TouchableOpacity>
        </ViewComponent>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: Platform.OS === "ios" ? 60 : 20,
    },
    label: { fontSize: 14, marginTop: 12, marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#fff",
    },
    saveBtn: {
        marginTop: 20,
        backgroundColor: "#27ae60",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    saveText: { color: "#fff", fontWeight: "600" },
});
