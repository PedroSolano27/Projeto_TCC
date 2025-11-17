import { Feather } from "@expo/vector-icons";
import {
    ActivityIndicator,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Separator } from "../components/Separator";
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

    const renderSettingRow = (
        label: string,
        description: string,
        control: React.ReactNode,
        isLast: boolean = false,
    ) => (
        <>
            <View
                style={[SettingsStyles.row, isLast && SettingsStyles.rowLast]}
            >
                <View style={{ flex: 1 }}>
                    <Text style={SettingsStyles.label}>{label}</Text>
                    <Text style={SettingsStyles.description}>
                        {description}
                    </Text>
                </View>
                {control}
            </View>
        </>
    );

    return (
        <ScrollView
            style={SettingsStyles.container}
            contentContainerStyle={SettingsStyles.scrollContent}
        >
            <View style={SettingsStyles.section}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <Feather
                        name={isDark ? "moon" : "sun"}
                        size={20}
                        color={isDark ? "#60A5FA" : "#F59E0B"}
                        style={{ marginRight: 8 }}
                    />
                    <Text style={SettingsStyles.sectionTitle}>Aparência</Text>
                </View>

                {renderSettingRow(
                    "Tema",
                    isDark ? "Modo escuro ativado" : "Modo claro ativado",
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        disabled={anyLoading}
                    />,
                    true,
                )}
            </View>

            <Separator theme={theme} variant="medium" />

            <View style={SettingsStyles.section}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <Feather
                        name="filter"
                        size={20}
                        color="#3B82F6"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={SettingsStyles.sectionTitle}>
                        Filtro Padrão
                    </Text>
                </View>

                <Text style={SettingsStyles.description}>
                    Escolha qual filtro é exibido ao iniciar o aplicativo
                </Text>

                <View style={SettingsStyles.filterRow}>
                    {(["all", "pending", "completed"] as const).map(
                        (filter) => (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    SettingsStyles.filterButton,
                                    taskFilter === filter &&
                                        SettingsStyles.filterButtonActive,
                                ]}
                                onPress={() => setTaskFilter(filter)}
                                disabled={anyLoading}
                                accessible={true}
                                accessibilityLabel={`Filtro: ${filter === "all" ? "Todas" : filter === "pending" ? "Pendentes" : "Concluídas"}`}
                                accessibilityRole="radio"
                                accessibilityState={{
                                    selected: taskFilter === filter,
                                }}
                            >
                                <Text
                                    style={[
                                        SettingsStyles.filterText,
                                        taskFilter === filter &&
                                            SettingsStyles.filterTextActive,
                                    ]}
                                >
                                    {filter === "all"
                                        ? "Todas"
                                        : filter === "pending"
                                          ? "Pendentes"
                                          : "Concluídas"}
                                </Text>
                            </TouchableOpacity>
                        ),
                    )}
                </View>
            </View>

            <Separator theme={theme} variant="medium" />

            <View style={SettingsStyles.section}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <Feather
                        name="database"
                        size={20}
                        color="#8B5CF6"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={SettingsStyles.sectionTitle}>Dados</Text>
                </View>

                <Text style={SettingsStyles.description}>
                    Faça backup ou restaure suas tarefas
                </Text>

                <TouchableOpacity
                    style={SettingsStyles.button}
                    onPress={exportTasks}
                    disabled={anyLoading}
                    accessible={true}
                    accessibilityLabel="Exportar tarefas"
                    accessibilityRole="button"
                    accessibilityHint="Cria um arquivo com suas tarefas para backup"
                >
                    {ioLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Feather
                                name="download"
                                size={18}
                                color="#fff"
                                style={{ marginRight: 8 }}
                            />
                            <Text style={SettingsStyles.buttonText}>
                                Exportar Tarefas
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        SettingsStyles.button,
                        SettingsStyles.buttonSuccess,
                    ]}
                    onPress={importTasks}
                    disabled={anyLoading}
                    accessible={true}
                    accessibilityLabel="Importar tarefas"
                    accessibilityRole="button"
                    accessibilityHint="Restaura tarefas de um arquivo de backup"
                >
                    {ioLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Feather
                                name="upload"
                                size={18}
                                color="#fff"
                                style={{ marginRight: 8 }}
                            />
                            <Text style={SettingsStyles.buttonText}>
                                Importar Tarefas
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <Separator theme={theme} variant="medium" />

            <View style={SettingsStyles.section}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <Feather
                        name="info"
                        size={20}
                        color="#6B7280"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={SettingsStyles.sectionTitle}>Informações</Text>
                </View>

                <View
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: isDark ? "#374151" : "#F3F4F6",
                        borderRadius: 8,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            color: isDark ? "#D1D5DB" : "#475569",
                            lineHeight: 18,
                        }}
                    >
                        {"\n"}📱{" "}
                        <Text style={{ fontWeight: "600" }}>Versão:</Text> 1.0.0
                        {"\n"}👤{" "}
                        <Text style={{ fontWeight: "600" }}>
                            Desenvolvedor:
                        </Text>{" "}
                        Pedro Henrique
                        {"\n"}🎓 <Text style={{ fontWeight: "600" }}>TCC:</Text>{" "}
                        Sistema de Gamificação
                        {"\n"}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
