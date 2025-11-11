import {
    ActivityIndicator,
    Switch,
    Text,
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
        loading: settingsLoading,
    } = useSettings();

    const { SettingsStyles } = createStyles(theme);
    const { exportTasks, importTasks, loading: ioLoading } = ExportTasks();

    const isDark = theme === "dark";
    const anyLoading = settingsLoading || ioLoading;

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
