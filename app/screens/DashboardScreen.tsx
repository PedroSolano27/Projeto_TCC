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
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = tasks.filter((t) => !t.completed).length;
    const totalTasks = tasks.length;
    const completionRate =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calcula progresso XP para o nível
    const requiredXP = Math.round(Math.pow(1.4, profile.level) * 100);
    const xpProgress = Math.min((profile.xp / requiredXP) * 100, 100);

    const recentCompleted = tasks
        .filter((t) => t.completed && t.completedAt)
        .sort((a, b) => {
            const dateA = new Date(a.completedAt || "").getTime();
            const dateB = new Date(b.completedAt || "").getTime();
            return dateB - dateA;
        })
        .slice(0, 10);

    // Emojis de conquista
    const getBadgeEmoji = (badgeId: string) => {
        const emojiMap: { [key: string]: string } = {
            firstTask: "🎯",
            fiveCompleted: "⭐",
            tenCompleted: "✨",
            twentyCompleted: "🏆",
            hundredPoints: "💎",
            streakThree: "🔥",
            streakSeven: "⚡",
            streakThirty: "👑",
            allTags: "🎨",
        };
        return emojiMap[badgeId] || "🏅";
    };

    return (
        <ScrollView style={TaskListStyles.container}>
            <View style={DashboardStyles.profileSection}>
                <Text style={DashboardStyles.welcomeText}>👋 Bem-vindo!</Text>

                <View style={DashboardStyles.profileCard}>
                    <View style={DashboardStyles.profileRow}>
                        <View style={DashboardStyles.profileColumn}>
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
                                    DashboardStyles.profileCoins,
                                ]}
                            >
                                {profile.coins}
                            </Text>
                        </View>
                    </View>

                    <View style={DashboardStyles.xpContainer}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 4,
                            }}
                        >
                            <Text style={DashboardStyles.xpLabel}>
                                Experiência
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "#999",
                                    fontWeight: "600",
                                }}
                            >
                                {Math.round(xpProgress)}%
                            </Text>
                        </View>
                        <View style={DashboardStyles.xpBar}>
                            <View
                                style={[
                                    DashboardStyles.xpFill,
                                    { width: `${xpProgress}%` },
                                ]}
                            />
                        </View>
                        <Text style={DashboardStyles.xpText}>
                            {profile.xp} / {requiredXP} XP
                        </Text>
                    </View>
                </View>

                <View style={DashboardStyles.streakCard}>
                    <Feather
                        name="zap"
                        size={24}
                        color="#F59E0B"
                        style={DashboardStyles.streakIcon}
                    />
                    <View style={DashboardStyles.streakContent}>
                        <Text style={DashboardStyles.streakLabel}>
                            Sequência de Dias
                        </Text>
                        <Text style={DashboardStyles.streakValue}>
                            {profile.streak}{" "}
                            {profile.streak === 1 ? "dia" : "dias"}
                        </Text>
                    </View>
                    {profile.streak >= 3 && (
                        <Text style={{ fontSize: 24 }}>
                            {profile.streak >= 30
                                ? "👑"
                                : profile.streak >= 7
                                  ? "⚡"
                                  : "🔥"}
                        </Text>
                    )}
                </View>
            </View>

            <Text style={DashboardStyles.sectionTitle}>
                📊 Estat\u00edsticas
            </Text>

            <View style={DashboardStyles.statsRow}>
                <View style={DashboardStyles.statCard}>
                    <Feather
                        name="check-circle"
                        size={28}
                        color="#22C55E"
                        style={DashboardStyles.statLabel}
                    />
                    <Text style={DashboardStyles.statLabel}>Concluídas</Text>
                    <Text style={DashboardStyles.statValue}>
                        {completedTasks}
                    </Text>
                </View>

                <View style={DashboardStyles.statCard}>
                    <Feather
                        name="clock"
                        size={28}
                        color="#F59E0B"
                        style={DashboardStyles.statLabel}
                    />
                    <Text style={DashboardStyles.statLabel}>Pendentes</Text>
                    <Text style={DashboardStyles.statValue}>
                        {pendingTasks}
                    </Text>
                </View>

                <View style={DashboardStyles.statCard}>
                    <Feather
                        name="trending-up"
                        size={28}
                        color="#3B82F6"
                        style={DashboardStyles.statLabel}
                    />
                    <Text style={DashboardStyles.statLabel}>Taxa</Text>
                    <Text style={DashboardStyles.statValue}>
                        {completionRate}%
                    </Text>
                </View>
            </View>

            {profile.badges && profile.badges.length > 0 && (
                <>
                    <Text style={DashboardStyles.sectionTitle}>
                        🏆 Conquistas ({profile.badges.length})
                    </Text>

                    <View style={DashboardStyles.badgesContainer}>
                        {profile.badges.map((badge) => (
                            <View
                                key={badge.id}
                                style={DashboardStyles.badgeItem}
                            >
                                <Text style={DashboardStyles.badgeIcon}>
                                    {getBadgeEmoji(badge.id)}
                                </Text>
                                <Text
                                    style={DashboardStyles.badgeTitle}
                                    numberOfLines={2}
                                >
                                    {badge.title}
                                </Text>
                                <Text
                                    style={DashboardStyles.badgeDescription}
                                    numberOfLines={2}
                                >
                                    {badge.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                </>
            )}

            {recentCompleted.length > 0 && (
                <>
                    <Text style={DashboardStyles.sectionTitle}>
                        ✅ Recentes
                    </Text>

                    <View
                        style={{
                            paddingHorizontal: 16,
                            marginBottom: 32,
                        }}
                    >
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
                                    <Text
                                        style={DashboardStyles.recentItemDate}
                                    >
                                        {item.completedAt
                                            ? new Date(
                                                  item.completedAt,
                                              ).toLocaleDateString("pt-BR", {
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
                </>
            )}
        </ScrollView>
    );
}
