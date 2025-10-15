// Tela de opções

// Terceiros
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSettings } from "../context/SettingsContext";
import { ExportTasks } from "../services/ExportTasks";
import { createStyles } from "../styles/ScreenStyles";

export default function SettingsScreen() {
    const {
        theme,
        toggleTheme,
        taskFilter,
        setTaskFilter,
        defaultReminderMinutes,
        setDefaultReminderMinutes,
        loading: settingsLoading,
    } = useSettings();

    const { SettingsStyles } = createStyles(theme);
    const { exportTasks, importTasks, loading: ioLoading } = ExportTasks();

    const isDark = theme === "dark";
    const [localReminder, setLocalReminder] = useState<string>(
        defaultReminderMinutes === null ? "" : String(defaultReminderMinutes),
    );
    const [savingReminder, setSavingReminder] = useState(false);

    // Define setLocalReminder toda vez que ele muda
    useEffect(() => {
        setLocalReminder(
            defaultReminderMinutes === null
                ? ""
                : String(defaultReminderMinutes),
        );
    }, [defaultReminderMinutes]);

    // Valida e salva lembrete padrão (null = sem lembrete)
    async function applyReminder() {
        Keyboard.dismiss();
        setSavingReminder(true);

        try {
            if (localReminder.trim() === "") {
                setDefaultReminderMinutes(null);
                Alert.alert(
                    "Configurações",
                    "Lembrete padrão removido (nenhum).",
                );

                return;
            }

            const n = Number(localReminder);

            if (!Number.isFinite(n) || n < 0) {
                Alert.alert(
                    "Valor inválido",
                    "Informe um número inteiro maior ou igual a 0.",
                );
                return;
            }

            setDefaultReminderMinutes(Math.floor(n));

            Alert.alert(
                "Configurações",
                `Lembrete padrão salvo: ${Math.floor(n)} minutos.`,
            );
        } catch (err) {
            console.warn("Erro ao salvar lembrete", err);
            Alert.alert("Erro", "Não foi possível salvar o lembrete padrão.");
        } finally {
            setSavingReminder(false);
        }
    }

    const anyLoading = settingsLoading || ioLoading || savingReminder;

    return (
        <View style={[SettingsStyles.container]}>
            <View style={SettingsStyles.section}>
                <Text style={SettingsStyles.label}>
                    {isDark ? "Tema Escuro" : "Tema Claro"}
                </Text>
                <Switch value={isDark} onValueChange={toggleTheme} />
            </View>

            <View style={SettingsStyles.section}>
                <Text style={SettingsStyles.label}>
                    Filtro padrão de tarefas
                </Text>

                <View style={SettingsStyles.filterRow}>
                    <TouchableOpacity
                        style={[
                            SettingsStyles.filterButton,
                            taskFilter === "all" &&
                                SettingsStyles.filterButtonActive,
                        ]}
                        onPress={() => setTaskFilter("all")}
                        disabled={anyLoading}
                    >
                        <Text
                            style={[
                                SettingsStyles.filterText,
                                taskFilter === "all" &&
                                    SettingsStyles.filterTextActive,
                            ]}
                        >
                            Todas
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            SettingsStyles.filterButton,
                            taskFilter === "completed" &&
                                SettingsStyles.filterButtonActive,
                        ]}
                        onPress={() => setTaskFilter("completed")}
                        disabled={anyLoading}
                    >
                        <Text
                            style={[
                                SettingsStyles.filterText,
                                taskFilter === "completed" &&
                                    SettingsStyles.filterTextActive,
                            ]}
                        >
                            Concluídas
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            SettingsStyles.filterButton,
                            taskFilter === "pending" &&
                                SettingsStyles.filterButtonActive,
                        ]}
                        onPress={() => setTaskFilter("pending")}
                        disabled={anyLoading}
                    >
                        <Text
                            style={[
                                SettingsStyles.filterText,
                                taskFilter === "pending" &&
                                    SettingsStyles.filterTextActive,
                            ]}
                        >
                            Pendentes
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={SettingsStyles.section}>
                <Text style={SettingsStyles.label}>
                    Lembrete padrão (minutos)
                </Text>

                <View style={SettingsStyles.reminderRow}>
                    <TextInput
                        style={SettingsStyles.input}
                        keyboardType="number-pad"
                        value={localReminder}
                        onChangeText={setLocalReminder}
                        placeholder="Ex: 60 (deixe vazio para nenhum)"
                        placeholderTextColor={isDark ? "#bbb" : "#666"}
                        editable={!anyLoading}
                        returnKeyType="done"
                        onSubmitEditing={applyReminder}
                    />
                    <TouchableOpacity
                        style={[
                            SettingsStyles.button,
                            SettingsStyles.smallButton,
                        ]}
                        onPress={applyReminder}
                        disabled={anyLoading}
                    >
                        {savingReminder ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={SettingsStyles.buttonText}>
                                Salvar
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={SettingsStyles.section}>
                <Text style={SettingsStyles.label}>Opções</Text>

                <TouchableOpacity
                    style={[SettingsStyles.button]}
                    onPress={exportTasks}
                    disabled={anyLoading}
                >
                    {ioLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={SettingsStyles.buttonText}>
                            Exportar tarefas
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[SettingsStyles.button, SettingsStyles.importButton]}
                    onPress={importTasks}
                    disabled={anyLoading}
                >
                    {ioLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={SettingsStyles.buttonText}>
                            Importar tarefas
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
