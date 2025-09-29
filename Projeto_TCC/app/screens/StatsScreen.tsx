// Tela de status

// Terceiros
import { View, Text, StyleSheet } from "react-native";

export default function StatsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo(a)!</Text>
            <Text>Gerencie suas tarefas e ganhe pontos 🎯</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
    title: { fontSize: 20, fontWeight: "bold" },
});
