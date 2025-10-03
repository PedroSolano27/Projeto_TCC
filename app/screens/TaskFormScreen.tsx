// Tela de Formulário de Tarefas

// Tipos
import { RootStackParamList } from "../types/StackParamList";
import { Task } from "../types/Task";

// Terceiros
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { TaskStorage } from "../services/TaskStorage";

// Elementos
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Form">;

export default function TaskFormScreen({ route, navigation }: Props) {
    const { addTask, updateTask } = TaskStorage();

    // Pega uma Task se ela já existe
    const existing = route.params?.task;

    const [title, setTitle] = useState(existing?.title || "");
    const [notes, setNotes] = useState(existing?.notes || "");
    const [dueDate, setDueDate] = useState(existing?.dueDate || "");
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(
        existing?.dueDate ? new Date(existing.dueDate) : new Date(),
    );

    // Cria uma tarefa nova ou salva uma editada
    async function save() {
        if (!title) {
            Alert.alert(
                "Campo obrigatório",
                "Por favor, insira um título para a tarefa.",
            );
            return;
        }

        // Atualiza se já existe
        if (existing) {
            const updated: Task = { ...existing, title, notes, dueDate };
            await updateTask(updated);

            navigation.goBack();
            return;
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

    // Salva a data
    function onChangeDate(_: any, selectedDate?: Date) {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setDueDate(selectedDate.toISOString());
        }
    }

    // Mostra o título correto
    useEffect(() => {
        navigation.setOptions({
            title: existing ? "Editar Tarefa" : "Nova Tarefa",
        });
    }, [existing, navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Título</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                style={[styles.input, !title && styles.inputError]}
                placeholder="Ex: Estudar para Prova"
            />

            <Text style={styles.label}>Notas</Text>
            <TextInput
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, { height: 80 }]}
                multiline
                placeholder="Detalhes..."
            />

            <Text style={styles.label}>Data de Vencimento</Text>
            <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={styles.dateBtn}
            >
                <Text style={styles.dateText}>
                    {date
                        ? date.toLocaleDateString("pt-BR")
                        : "Selecionar data"}
                </Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeDate}
                />
            )}

            <TouchableOpacity
                onPress={save}
                disabled={!title}
                style={[styles.saveBtn, !title && styles.saveBtnDisabled]}
            >
                <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
        </View>
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
    inputError: { borderColor: "#e74c3c" },
    saveBtn: {
        marginTop: 20,
        backgroundColor: "#27ae60",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    dateBtn: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    saveBtnDisabled: { backgroundColor: "#9bd6a6" },
    saveText: { color: "#fff", fontWeight: "600" },
    dateText: {
        fontSize: 16,
        color: "#333",
    },
});
