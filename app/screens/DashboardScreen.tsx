/* eslint-disable react-hooks/exhaustive-deps */
// Tela de Dashboard de Progresso

// Tipos
import { UserProfile } from "../types/GamificationTypes";
import { RootStackParamList } from "../types/StackParamList";
import { Task } from "../types/Task";

// Terceiros
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { TaskStorage } from "../services/TaskStorage";
import { loadProfile } from "../services/UserProfileStorage";
import { createStyles } from "../styles/ScreenStyles";

// Elementos
import { Feather } from "@expo/vector-icons";
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    Text,
    View,
} from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
    const { theme } = useSettings();
    const { getAllTasks } = TaskStorage();
    const { TaskListStyles } = createStyles(theme);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Carrega dados
    async function loadData() {
        try {
            const allTasks = await getAllTasks();
            const userProfile = await loadProfile();

            setTasks(allTasks);
            setProfile(userProfile);
        } catch (err) {
            console.warn("Erro ao carregar dados do dashboard", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            loadData();
        });
        loadData();

        return unsubscribe;
    }, [navigation]);

    if (loading || !profile) {
        return (
            <View
                style={[
                    TaskListStyles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Calcula estatísticas
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = tasks.filter((t) => !t.completed).length;
    const totalTasks = tasks.length;
    const completionRate =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Tarefas concluídas recentes (últimas 10)
    const recentCompleted = tasks
        .filter((t) => t.completed && t.completedAt)
        .sort((a, b) => {
            const dateA = new Date(a.completedAt || "").getTime();
            const dateB = new Date(b.completedAt || "").getTime();
            return dateB - dateA;
        })
        .slice(0, 10);

    return (
        <ScrollView style={TaskListStyles.container}>
            {/* Seção de Perfil do Usuário */}
            <View
                style={{
                    padding: 16,
                    backgroundColor: theme === "light" ? "#f5f5f5" : "#1f1f1f",
                    marginBottom: 16,
                }}
            >
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 12,
                    }}
                >
                    Bem-vindo!
                </Text>

                {/* Nível e XP */}
                <View
                    style={{
                        marginBottom: 12,
                        padding: 12,
                        backgroundColor:
                            theme === "light" ? "#ffffff" : "#2a2a2a",
                        borderRadius: 8,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: theme === "light" ? "#666" : "#aaa",
                                }}
                            >
                                Nível
                            </Text>
                            <Text style={{ fontSize: 28, fontWeight: "bold" }}>
                                {profile.level}
                            </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: theme === "light" ? "#666" : "#aaa",
                                }}
                            >
                                Pontos
                            </Text>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                {profile.points}
                            </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: theme === "light" ? "#666" : "#aaa",
                                }}
                            >
                                Moedas
                            </Text>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: "#FFD700",
                                }}
                            >
                                {profile.coins}
                            </Text>
                        </View>
                    </View>

                    {/* XP Bar */}
                    <View style={{ marginTop: 12 }}>
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme === "light" ? "#666" : "#aaa",
                                marginBottom: 4,
                            }}
                        >
                            Experiência
                        </Text>
                        <View
                            style={{
                                height: 8,
                                backgroundColor:
                                    theme === "light" ? "#e0e0e0" : "#404040",
                                borderRadius: 4,
                                overflow: "hidden",
                            }}
                        >
                            <View
                                style={{
                                    height: "100%",
                                    width: `${Math.min((profile.xp / 100) * 100, 100)}%`,
                                    backgroundColor: "#4CAF50",
                                }}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 11,
                                color: theme === "light" ? "#666" : "#aaa",
                                marginTop: 4,
                            }}
                        >
                            {profile.xp} / ~
                            {Math.round(Math.pow(1.4, profile.level) * 100)}
                        </Text>
                    </View>
                </View>

                {/* Streak */}
                <View
                    style={{
                        padding: 12,
                        backgroundColor:
                            theme === "light" ? "#ffffff" : "#2a2a2a",
                        borderRadius: 8,
                    }}
                >
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Feather
                            name="zap"
                            size={20}
                            color="#FF9800"
                            style={{ marginRight: 8 }}
                        />
                        <View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: theme === "light" ? "#666" : "#aaa",
                                }}
                            >
                                Sequência de Dias
                            </Text>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                                {profile.streak} dias
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Estatísticas de Produtividade */}
            <View
                style={{
                    padding: 16,
                    backgroundColor: theme === "light" ? "#f5f5f5" : "#1f1f1f",
                    marginBottom: 16,
                }}
            >
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 12,
                    }}
                >
                    Estatísticas de Produtividade
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Concluídas */}
                    <View
                        style={{
                            flex: 1,
                            padding: 12,
                            backgroundColor:
                                theme === "light" ? "#ffffff" : "#2a2a2a",
                            borderRadius: 8,
                            marginRight: 8,
                            alignItems: "center",
                        }}
                    >
                        <Feather
                            name="check-circle"
                            size={24}
                            color="#4CAF50"
                            style={{ marginBottom: 8 }}
                        />
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme === "light" ? "#666" : "#aaa",
                            }}
                        >
                            Concluídas
                        </Text>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            {completedTasks}
                        </Text>
                    </View>

                    {/* Pendentes */}
                    <View
                        style={{
                            flex: 1,
                            padding: 12,
                            backgroundColor:
                                theme === "light" ? "#ffffff" : "#2a2a2a",
                            borderRadius: 8,
                            marginRight: 8,
                            alignItems: "center",
                        }}
                    >
                        <Feather
                            name="clock"
                            size={24}
                            color="#FF9800"
                            style={{ marginBottom: 8 }}
                        />
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme === "light" ? "#666" : "#aaa",
                            }}
                        >
                            Pendentes
                        </Text>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            {pendingTasks}
                        </Text>
                    </View>

                    {/* Taxa de Conclusão */}
                    <View
                        style={{
                            flex: 1,
                            padding: 12,
                            backgroundColor:
                                theme === "light" ? "#ffffff" : "#2a2a2a",
                            borderRadius: 8,
                            alignItems: "center",
                        }}
                    >
                        <Feather
                            name="pie-chart"
                            size={24}
                            color="#2196F3"
                            style={{ marginBottom: 8 }}
                        />
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme === "light" ? "#666" : "#aaa",
                            }}
                        >
                            Taxa
                        </Text>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            {completionRate}%
                        </Text>
                    </View>
                </View>
            </View>

            {/* Conquistas/Badges */}
            {profile.badges.length > 0 && (
                <View
                    style={{
                        padding: 16,
                        backgroundColor:
                            theme === "light" ? "#f5f5f5" : "#1f1f1f",
                        marginBottom: 16,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 12,
                        }}
                    >
                        Conquistas ({profile.badges.length})
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-around",
                        }}
                    >
                        {profile.badges.map((badge) => (
                            <View
                                key={badge.id}
                                style={{
                                    width: "30%",
                                    padding: 12,
                                    backgroundColor:
                                        theme === "light"
                                            ? "#ffffff"
                                            : "#2a2a2a",
                                    borderRadius: 8,
                                    alignItems: "center",
                                    marginBottom: 12,
                                }}
                            >
                                <Feather
                                    name="award"
                                    size={24}
                                    color="#FFD700"
                                    style={{ marginBottom: 4 }}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    {badge.title}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color:
                                            theme === "light" ? "#999" : "#666",
                                        textAlign: "center",
                                        marginTop: 4,
                                    }}
                                >
                                    {badge.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Tarefas Concluídas Recentes */}
            {recentCompleted.length > 0 && (
                <View
                    style={{
                        padding: 16,
                        backgroundColor:
                            theme === "light" ? "#f5f5f5" : "#1f1f1f",
                        marginBottom: 16,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 12,
                        }}
                    >
                        Tarefas Concluídas Recentes
                    </Text>

                    <FlatList
                        scrollEnabled={false}
                        data={recentCompleted}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    padding: 12,
                                    backgroundColor:
                                        theme === "light"
                                            ? "#ffffff"
                                            : "#2a2a2a",
                                    borderRadius: 8,
                                    marginBottom: 8,
                                    borderLeftWidth: 4,
                                    borderLeftColor: "#4CAF50",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "500",
                                        marginBottom: 4,
                                    }}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color:
                                            theme === "light" ? "#666" : "#aaa",
                                    }}
                                >
                                    Concluída em:{" "}
                                    {item.completedAt
                                        ? new Date(
                                              item.completedAt,
                                          ).toLocaleDateString("pt-BR", {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "Sem data"}
                                </Text>
                                {item.points && (
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: "#4CAF50",
                                            fontWeight: "bold",
                                            marginTop: 4,
                                        }}
                                    >
                                        +{item.points} pontos
                                    </Text>
                                )}
                            </View>
                        )}
                    />
                </View>
            )}
        </ScrollView>
    );
}
