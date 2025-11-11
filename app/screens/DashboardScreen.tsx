import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSettings } from "../context/SettingsContext";
import { TaskStorage } from "../services/TaskStorage";
import { loadProfile } from "../services/UserProfileStorage";
import { createStyles } from "../styles/ScreenStyles";
import { UserProfile } from "../types/GamificationTypes";
import { RootStackParamList } from "../types/StackParamList";
import { Task } from "../types/Task";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
    const { theme } = useSettings();
    const { getAllTasks } = TaskStorage();
    const { TaskListStyles, DashboardStyles } = createStyles(theme);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
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
    }, [getAllTasks]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", loadData);
        loadData();
        return unsubscribe;
    }, [navigation, loadData]);

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

    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = tasks.filter((t) => !t.completed).length;
    const totalTasks = tasks.length;
    const completionRate =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
            <View style={DashboardStyles.profileSection}>
                <Text style={DashboardStyles.sectionTitle}>Bem-vindo!</Text>

                <View style={DashboardStyles.profileCard}>
                    <View style={DashboardStyles.profileRow}>
                        <View>
                            <Text style={DashboardStyles.profileLabel}>
                                Nível
                            </Text>
                            <Text style={DashboardStyles.profileValue}>
                                {profile.level}
                            </Text>
                        </View>
                        <View style={DashboardStyles.profileColumn}>
                            <Text style={DashboardStyles.profileLabel}>
                                Pontos
                            </Text>
                            <Text style={DashboardStyles.profileValue}>
                                {profile.points}
                            </Text>
                        </View>
                        <View style={DashboardStyles.profileColumn}>
                            <Text style={DashboardStyles.profileLabel}>
                                Moedas
                            </Text>
                            <Text
                                style={[
                                    DashboardStyles.profileValue,
                                    { color: "#FFD700" },
                                ]}
                            >
                                {profile.coins}
                            </Text>
                        </View>
                    </View>

                    <View style={DashboardStyles.xpContainer}>
                        <Text style={DashboardStyles.xpLabel}>Experiência</Text>
                        <View style={DashboardStyles.xpBar}>
                            <View
                                style={[
                                    DashboardStyles.xpFill,
                                    {
                                        width: `${Math.min(
                                            (profile.xp / 100) * 100,
                                            100,
                                        )}%`,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={DashboardStyles.xpText}>
                            {profile.xp} / ~
                            {Math.round(Math.pow(1.4, profile.level) * 100)}
                        </Text>
                    </View>
                </View>

                <View style={DashboardStyles.streakCard}>
                    <Feather
                        name="zap"
                        size={20}
                        color="#FF9800"
                        style={DashboardStyles.streakIcon}
                    />
                    <View>
                        <Text style={DashboardStyles.streakLabel}>
                            Sequência de Dias
                        </Text>
                        <Text style={DashboardStyles.streakValue}>
                            {profile.streak} dias
                        </Text>
                    </View>
                </View>
            </View>

            <View style={DashboardStyles.statsSection}>
                <Text style={DashboardStyles.statsTitle}>
                    Estatísticas de Produtividade
                </Text>

                <View style={DashboardStyles.statsRow}>
                    <View style={DashboardStyles.statCard}>
                        <Feather
                            name="check-circle"
                            size={24}
                            color="#4CAF50"
                            style={DashboardStyles.statIcon}
                        />
                        <Text style={DashboardStyles.statLabel}>
                            Concluídas
                        </Text>
                        <Text style={DashboardStyles.statValue}>
                            {completedTasks}
                        </Text>
                    </View>

                    <View style={DashboardStyles.statCard}>
                        <Feather
                            name="clock"
                            size={24}
                            color="#FF9800"
                            style={DashboardStyles.statIcon}
                        />
                        <Text style={DashboardStyles.statLabel}>Pendentes</Text>
                        <Text style={DashboardStyles.statValue}>
                            {pendingTasks}
                        </Text>
                    </View>

                    <View
                        style={[
                            DashboardStyles.statCard,
                            DashboardStyles.statCardLast,
                        ]}
                    >
                        <Feather
                            name="pie-chart"
                            size={24}
                            color="#2196F3"
                            style={DashboardStyles.statIcon}
                        />
                        <Text style={DashboardStyles.statLabel}>Taxa</Text>
                        <Text style={DashboardStyles.statValue}>
                            {completionRate}%
                        </Text>
                    </View>
                </View>
            </View>

            {profile.badges.length > 0 && (
                <View style={DashboardStyles.badgesSection}>
                    <Text style={DashboardStyles.badgesTitle}>
                        Conquistas ({profile.badges.length})
                    </Text>

                    <View style={DashboardStyles.badgesContainer}>
                        {profile.badges.map((badge) => (
                            <View
                                key={badge.id}
                                style={DashboardStyles.badgeItem}
                            >
                                <Feather
                                    name="award"
                                    size={24}
                                    color="#FFD700"
                                    style={DashboardStyles.badgeIcon}
                                />
                                <Text style={DashboardStyles.badgeTitle}>
                                    {badge.title}
                                </Text>
                                <Text style={DashboardStyles.badgeDescription}>
                                    {badge.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {recentCompleted.length > 0 && (
                <View style={DashboardStyles.recentSection}>
                    <Text style={DashboardStyles.recentTitle}>
                        Tarefas Concluídas Recentes
                    </Text>

                    <FlatList
                        scrollEnabled={false}
                        data={recentCompleted}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={DashboardStyles.recentItem}>
                                <Text
                                    style={DashboardStyles.recentItemTitle}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                                <Text style={DashboardStyles.recentItemDate}>
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
                            </View>
                        )}
                    />
                </View>
            )}
        </ScrollView>
    );
}
