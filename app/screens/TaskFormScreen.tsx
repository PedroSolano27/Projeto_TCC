// Tela de Formulário de Tarefas

// Tipos
import { RootStackParamList } from "../types/StackParamList";
import { Task } from "../types/Task";

// Terceiros
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useSettings } from "../context/SettingsContext";
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
    const { theme } = useSettings();
    const { addTask, updateTask } = TaskStorage();
    const { TaskFormStyles } = createStyles(theme);

    // Pega uma Task se ela já existe
    const existing = route.params?.task as Task | undefined;

    const [title, setTitle] = useState<string>(existing?.title || "");
    const [notes, setNotes] = useState<string>(existing?.notes || "");
    const [showPicker, setShowPicker] = useState<boolean>(false);
    const [dueDate, setDueDate] = useState<string | undefined>(
        existing?.dueDate || undefined,
    );
    const [date, setDate] = useState<Date>(
        existing?.dueDate ? new Date(existing.dueDate) : new Date(),
    );
    const [pointsText, setPointsText] = useState<string>(
        typeof existing?.points === "number" ? String(existing?.points) : "",
    );
    const [xpText, setXpText] = useState<string>(
        typeof existing?.xpReward === "number"
            ? String(existing?.xpReward)
            : "",
    );

    // Tags (vírgula separados)
    const [tagsText, setTagsText] = useState<string>(
        existing?.tags?.join(", ") || "",
    );

    // Título da tela
    useEffect(() => {
        navigation.setOptions({
            title: existing ? "Editar Tarefa" : "Nova Tarefa",
        });
    }, [existing, navigation]);

    // Salva a data selecionada no formato ISO
    function onChangeDate(_: any, selectedDate?: Date) {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setDueDate(selectedDate.toISOString());
        }
    }

    // Valida e converte tags string -> string[]
    function parseTags(text: string) {
        return text
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    // Converte campo numérico seguro
    function parseNumber(text: string) {
        const n = Number(text);
        return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : undefined;
    }

    // Salva (cria ou atualiza)
    async function save() {
        if (!title.trim()) {
            Alert.alert(
                "Campo obrigatório",
                "Por favor, insira um título para a tarefa.",
            );
            return;
        }

        const tags = parseTags(tagsText);
        const points = parseNumber(pointsText);
        const xpReward = parseNumber(xpText);

        // Atualiza se já existe
        if (existing && existing.id) {
            const updated: Task = {
                ...existing,
                tags,
                notes,
                points,
                dueDate,
                xpReward,
                title: title.trim(),
            };
            try {
                await updateTask(updated);
                navigation.goBack();
            } catch (err) {
                console.warn("Erro ao atualizar tarefa", err);
                Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
            }
            return;
        }

        // Cria nova tarefa
        const newTask: Task = {
            notes,
            tags,
            points,
            dueDate,
            xpReward,
            id: uuidv4(),
            completed: false,
            title: title.trim(),
            notificationId: null,
            completedAt: undefined,
            createdAt: new Date().toISOString(),
        };

        try {
            await addTask(newTask);
            navigation.goBack();
        } catch (err) {
            console.warn("Erro ao adicionar tarefa", err);
            Alert.alert("Erro", "Não foi possível criar a tarefa.");
        }
    }

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
                placeholder="Ex: Estudar para prova"
                returnKeyType="done"
            />

            <Text style={TaskFormStyles.label}>Notas</Text>
            <TextInput
                value={notes}
                onChangeText={setNotes}
                style={[TaskFormStyles.input, { height: 80 }]}
                multiline
                placeholder="Detalhes..."
            />

            <Text style={TaskFormStyles.label}>Tags (vírgula separados)</Text>
            <TextInput
                value={tagsText}
                onChangeText={setTagsText}
                style={TaskFormStyles.input}
                placeholder="ex: estudos, trabalho"
            />

            <Text style={TaskFormStyles.label}>Pontos (opcional)</Text>
            <TextInput
                value={pointsText}
                onChangeText={setPointsText}
                style={TaskFormStyles.input}
                placeholder="Ex: 10"
                keyboardType="number-pad"
            />

            <Text style={TaskFormStyles.label}>XP reward (opcional)</Text>
            <TextInput
                value={xpText}
                onChangeText={setXpText}
                style={TaskFormStyles.input}
                placeholder="Ex: 15"
                keyboardType="number-pad"
            />

            <Text style={TaskFormStyles.label}>Data de Vencimento</Text>
            <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={TaskFormStyles.dateBtn}
            >
                <Text style={TaskFormStyles.dateText}>
                    {dueDate
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
                disabled={!title.trim()}
                style={[
                    TaskFormStyles.saveBtn,
                    !title.trim() && TaskFormStyles.saveBtnDisabled,
                ]}
            >
                <Text style={TaskFormStyles.saveText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}
