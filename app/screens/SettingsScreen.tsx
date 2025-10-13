// Tela de opções

// Terceiros
import { ActivityIndicator, Switch, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { ExportTasks } from "../services/ExportTasks";
import { createStyles } from "../styles/ScreenStyles";

export default function SettingsScreen() {
    const { theme, toggleTheme } = useTheme();
    const { SettingsStyles } = createStyles(theme);
    const { exportTasks, importTasks, loading } = ExportTasks();

    const isDark = theme === "dark";

    return (
        <View style={[SettingsStyles.container]}>
            <Text style={[SettingsStyles.label]}>
                {isDark ? "Tema Claro" : "Tema Escuro"}
            </Text>
            <Switch value={isDark} onValueChange={toggleTheme} />

            <View style={[SettingsStyles.container]}>
                <Text style={[SettingsStyles.label]}>Opções</Text>

                <TouchableOpacity
                    style={[SettingsStyles.button]}
                    onPress={exportTasks}
                    disabled={loading}
                >
                    {loading ? (
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
                    disabled={loading}
                >
                    {loading ? (
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
