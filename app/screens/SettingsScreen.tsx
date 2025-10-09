// Tela de opções

// Terceiros
import { Switch, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { createStyles } from "../styles/ScreenStyles";

export default function SettingsScreen() {
    const { theme, toggleTheme } = useTheme();
    const { SettingsStyles } = createStyles(theme);

    const isDark = theme === "dark";

    return (
        <View style={[SettingsStyles.container]}>
            <Text style={[SettingsStyles.label]}>
                {isDark ? "Tema Claro" : "Tema Escuro"}
            </Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
    );
}
