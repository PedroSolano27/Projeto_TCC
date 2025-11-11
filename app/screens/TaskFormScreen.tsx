import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { TagSelector } from "../components/TagSelector";
import { TimeSelector } from "../components/TimeSelector";
import { DEFAULT_TAG } from "../config/tags";
import { useSettings } from "../context/SettingsContext";
import { TaskStorage } from "../services/TaskStorage";
import { createStyles } from "../styles/ScreenStyles";
import { RootStackParamList } from "../types/StackParamList";
import { Task } from "../types/Task";

type Props = NativeStackScreenProps<RootStackParamList, "Form">;

export default function TaskFormScreen({ route, navigation }: Props) {
    const { theme } = useSettings();
    const { addTask, updateTask } = TaskStorage();
    const { TaskFormStyles } = createStyles(theme);

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
    const [selectedTag, setSelectedTag] = useState<string>(
        existing?.selectedTag || DEFAULT_TAG,
    );
    // Initialize notification times with existing values or empty array
    // This ensures user-selected notification preferences persist when editing
    const [selectedTimes, setSelectedTimes] = useState<string[]>(
        existing?.notificationIds || [],
    );

    useEffect(() => {
        navigation.setOptions({
            title: existing ? "Editar Tarefa" : "Nova Tarefa",
        });
    }, [existing, navigation]);

    function onChangeDate(_: any, selectedDate?: Date) {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setDueDate(selectedDate.toISOString());
        }
    }

    async function save() {
        if (!title.trim()) {
            Alert.alert(
                "Campo obrigatório",
                "Por favor, insira um título para a tarefa.",
            );
            return;
        }

        if (existing && existing.id) {
            const updated: Task = {
                ...existing,
                title: title.trim(),
                notes,
                selectedTag,
                dueDate,
                notificationIds:
                    selectedTimes.length > 0 ? selectedTimes : undefined,
            };
            try {
                await updateTask(updated);
                navigation.goBack();
            } catch {
                Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
            }
            return;
        }

        const newTask: Task = {
            id: uuidv4(),
            title: title.trim(),
            notes,
            selectedTag,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString(),
            notificationIds:
                selectedTimes.length > 0 ? selectedTimes : undefined,
        };

        try {
            await addTask(newTask);
            navigation.goBack();
        } catch {
            Alert.alert("Erro", "Não foi possível criar a tarefa.");
        }
    }

    return (
        <ScrollView
            style={TaskFormStyles.container}
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            <View style={TaskFormStyles.formGroup}>
                <Text style={TaskFormStyles.label}>Título</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    style={[
                        TaskFormStyles.input,
                        !title && TaskFormStyles.inputError,
                    ]}
                    placeholder="Ex: Estudar para prova"
                    placeholderTextColor="#999"
                    returnKeyType="done"
                />
            </View>

            <View style={TaskFormStyles.formGroup}>
                <Text style={TaskFormStyles.label}>Notas</Text>
                <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    style={[TaskFormStyles.input, { height: 80 }]}
                    multiline
                    placeholder="Detalhes adicionais..."
                    placeholderTextColor="#999"
                />
            </View>

            <TagSelector
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                theme={theme}
            />

            <TimeSelector
                selectedTimes={selectedTimes}
                onSelectTimes={setSelectedTimes}
                theme={theme}
            />

            <View style={TaskFormStyles.formGroup}>
                <Text style={TaskFormStyles.label}>Data de Vencimento</Text>
                <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={TaskFormStyles.dateBtn}
                >
                    <Text style={TaskFormStyles.dateText}>
                        {dueDate
                            ? date.toLocaleDateString("pt-BR")
                            : "Selecionar data (opcional)"}
                    </Text>
                </TouchableOpacity>
            </View>

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
                <Text style={TaskFormStyles.saveText}>Salvar Tarefa</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
