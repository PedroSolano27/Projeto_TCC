import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { Appearance } from "react-native";

type Theme = "light" | "dark";
type TaskFilter = "all" | "completed" | "pending";

type Settings = {
    theme: Theme;
    taskFilter: TaskFilter;
};

type SettingsContextType = Settings & {
    loading: boolean;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
    setTaskFilter: (f: TaskFilter) => void;
    resetSettings: () => void;
};

const STORAGE_KEY = "@app_settings_v1";

const defaults: Settings = {
    theme: (Appearance.getColorScheme() ?? "light") as Theme,
    taskFilter: "all",
};

const SettingsContext = createContext<SettingsContextType>({
    ...defaults,
    loading: false,
    toggleTheme: () => {},
    setTheme: () => {},
    setTaskFilter: () => {},
    resetSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [theme, setThemeState] = useState<Theme>(defaults.theme);
    const [taskFilter, setTaskFilterState] = useState<TaskFilter>(
        defaults.taskFilter,
    );

    // Carrega configurações do armazenamento assíncrono na inicialização do aplicativo
    useEffect(() => {
        let mounted = true;
        const loadSettings = async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);

                if (!raw) {
                    // Primeira configuração: salva configurações padrão
                    await AsyncStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(defaults),
                    );

                    if (!mounted) return;

                    setThemeState(defaults.theme);
                    setTaskFilterState(defaults.taskFilter);
                }

                // Carrega configurações existentes do armazenamento
                if (raw) {
                    const parsed = JSON.parse(raw) as Partial<Settings>;

                    if (!mounted) return;

                    if (parsed.theme) setThemeState(parsed.theme);
                    if (parsed.taskFilter)
                        setTaskFilterState(parsed.taskFilter);
                }
            } catch (err) {
                console.warn("Erro ao carregar settings", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadSettings();

        return () => {
            mounted = false;
        };
    }, []);

    // Persiste configurações para armazenamento assíncrono
    const persist = useCallback(
        async (next: Partial<Settings>) => {
            try {
                const current: Settings = {
                    theme,
                    taskFilter,
                };
                const merged: Settings = { ...current, ...next };

                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch (err) {
                console.warn("Erro ao persistir settings", err);
            }
        },
        [theme, taskFilter],
    );

    const toggleTheme = useCallback(() => {
        const next = theme === "light" ? "dark" : "light";
        setThemeState(next);
        persist({ theme: next });
    }, [theme, persist]);

    const setTheme = useCallback(
        (t: Theme) => {
            setThemeState(t);
            persist({ theme: t });
        },
        [persist],
    );

    const setTaskFilter = useCallback(
        (f: TaskFilter) => {
            setTaskFilterState(f);
            persist({ taskFilter: f });
        },
        [persist],
    );

    const resetSettings = useCallback(async () => {
        try {
            setLoading(true);
            setThemeState(defaults.theme);
            setTaskFilterState(defaults.taskFilter);

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        } catch (err) {
            console.warn("Erro ao resetar settings", err);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <SettingsContext.Provider
            value={{
                theme,
                taskFilter,
                loading,
                toggleTheme,
                setTheme,
                setTaskFilter,
                resetSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}
