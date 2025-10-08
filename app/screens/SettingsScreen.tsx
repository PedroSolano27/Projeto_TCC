// Tela de opções

// Terceiros
import { StyleSheet, Switch, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SettingsScreen() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <View style={[styles.container, isDark && styles.dark]}>
            <Text style={[styles.label, isDark && styles.darkText]}>
                Tema Escuro
            </Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    dark: { backgroundColor: "#222" },
    label: { fontSize: 18, marginBottom: 12, color: "#333" },
    darkText: { color: "#eee" },
});
