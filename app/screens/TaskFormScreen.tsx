// Tela de Formulário de Tarefas

// Tipos
import { RootStackParamList } from "../types/StackParamList";
import { Task } from "../types/Task";

// Terceiros
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "../context/ThemeContext";
import { TaskStorage } from "../services/TaskStorage";
import { createStyles } from "../styles/ScreenStyles";

// Elementos
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    Alert,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Form">;

export default function TaskFormScreen({ route, navigation }: Props) {
    const { addTask, updateTask } = TaskStorage();
    const { theme } = useTheme();
    const { TaskFormStyles } = createStyles(theme);

    // Pega uma Task se ela já existe
    const existing = route.params?.task;

    const [title, setTitle] = useState<string>(existing?.title || "");
    const [notes, setNotes] = useState<string>(existing?.notes || "");
    const [dueDate, setDueDate] = useState<string>(existing?.dueDate || "");
    const [showPicker, setShowPicker] = useState<boolean>(false);
    const [date, setDate] = useState<Date>(
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
        <View style={TaskFormStyles.container}>
            <Text style={TaskFormStyles.label}>Título</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                style={[
                    TaskFormStyles.input,
                    !title && TaskFormStyles.inputError,
                ]}
                placeholder="Ex: Estudar para Prova"
            />

            <Text style={TaskFormStyles.label}>Notas</Text>
            <TextInput
                value={notes}
                onChangeText={setNotes}
                style={[TaskFormStyles.input, { height: 80 }]}
                multiline
                placeholder="Detalhes..."
            />

            <Text style={TaskFormStyles.label}>Data de Vencimento</Text>
            <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={TaskFormStyles.dateBtn}
            >
                <Text style={TaskFormStyles.dateText}>
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
                style={[
                    TaskFormStyles.saveBtn,
                    !title && TaskFormStyles.saveBtnDisabled,
                ]}
            >
                <Text style={TaskFormStyles.saveText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}
