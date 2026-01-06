import { Feather } from "@expo/vector-icons";
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
import { HourMinuteSelector } from "../components/HourMinuteSelector";
import { Separator } from "../components/Separator";
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
    const [selectedTimes, setSelectedTimes] = useState<string[]>(
        existing?.notificationIds || [],
    );

    useEffect(() => {
        navigation.setOptions({
            title: existing ? "Editar Tarefa" : "Nova Tarefa",
            headerShown: true,
        });
    }, [existing, navigation]);

    function onChangeDate(_: any, selectedDate?: Date) {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setDueDate(selectedDate.toISOString());
            return;
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

    const formatDateDisplay = () => {
        if (!dueDate) return "Selecionar data (opcional)";
        const d = new Date(dueDate);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (d.toDateString() === today.toDateString()) return "Hoje";
        if (d.toDateString() === tomorrow.toDateString()) return "Amanhã";
        return d.toLocaleDateString("pt-BR", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const handleCustomTime = (timestamp: string) => {
        const due = new Date(timestamp);

        setDate(due);
        setDueDate(timestamp);
        return;
    };

    return (
        <ScrollView
            style={TaskFormStyles.container}
            contentContainerStyle={TaskFormStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={TaskFormStyles.sectionTitle}>Tarefa</Text>

            <View style={TaskFormStyles.formGroup}>
                <Text style={TaskFormStyles.label}>Título *</Text>
                <Text style={TaskFormStyles.hint}>
                    Um nome claro e descritivo para sua tarefa
                </Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    style={[
                        TaskFormStyles.input,
                        !title && TaskFormStyles.inputError,
                    ]}
                    placeholder="Ex: Estudar para prova de matemática"
                    placeholderTextColor="#999"
                    returnKeyType="next"
                    accessibilityLabel="Título da tarefa"
                    accessible={true}
                />
            </View>

            <View style={TaskFormStyles.formGroup}>
                <Text style={TaskFormStyles.label}>Notas</Text>
                <Text style={TaskFormStyles.hint}>
                    Adicione detalhes, lembretes ou subtarefas
                </Text>
                <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    style={[TaskFormStyles.input, TaskFormStyles.textAreaInput]}
                    multiline
                    numberOfLines={4}
                    placeholder="Ex: Revisar capítulos 1-3, fazer exercícios..."
                    placeholderTextColor="#999"
                    textAlignVertical="top"
                    accessibilityLabel="Notas da tarefa"
                    accessible={true}
                />
            </View>

            <Separator theme={theme} variant="medium" />

            <Text style={TaskFormStyles.sectionTitle}>Configurações</Text>

            <TagSelector
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                theme={theme}
            />

            <View style={TaskFormStyles.formGroup}>
                <Text style={TaskFormStyles.label}>Data de Vencimento</Text>
                <Text style={TaskFormStyles.hint}>
                    Defina quando a tarefa deve ser concluída
                </Text>
                <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={TaskFormStyles.dateBtn}
                    accessibilityLabel="Data de vencimento"
                    accessible={true}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={TaskFormStyles.dateText}>
                            {formatDateDisplay()}
                        </Text>
                        <Feather name="calendar" size={18} color="#3B82F6" />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={TaskFormStyles.formGroup}>
                <Text style={TaskFormStyles.label}>Data Customizada</Text>
                <Text style={TaskFormStyles.hint}>
                    Defina o horário (hora/minuto) para expiração
                </Text>
                <HourMinuteSelector
                    onSelectTime={handleCustomTime}
                    theme={theme}
                    selectedDate={dueDate}
                />
            </View>

            <TimeSelector
                selectedTimes={selectedTimes}
                onSelectTimes={setSelectedTimes}
                theme={theme}
            />

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeDate}
                />
            )}

            <Separator theme={theme} variant="medium" />

            <View style={TaskFormStyles.buttonRow}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={TaskFormStyles.cancelBtn}
                    accessibilityLabel="Cancelar"
                    accessible={true}
                >
                    <Text style={TaskFormStyles.cancelButtonText}>
                        Cancelar
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={save}
                    disabled={!title.trim()}
                    style={[
                        TaskFormStyles.saveBtn,
                        !title.trim() && TaskFormStyles.saveBtnDisabled,
                    ]}
                    accessibilityLabel="Salvar tarefa"
                    accessible={true}
                    accessibilityState={{ disabled: !title.trim() }}
                >
                    <Text style={TaskFormStyles.buttonText}>
                        {existing ? "Atualizar" : "Criar"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
