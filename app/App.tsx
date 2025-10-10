// App principal

// Tipos
import { RootStackParamList } from "./types/StackParamList";

// Terceiros
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { enableScreens } from "react-native-screens";
import { ThemeProvider } from "./context/ThemeContext";

// Elementos
import SettingsScreen from "./screens/SettingsScreen";
import TaskFormScreen from "./screens/TaskFormScreen";
import TaskListScreen from "./screens/TaskListScreen";

enableScreens();

// Cria a pilha
const Stack = createNativeStackNavigator<RootStackParamList>();

// Configura notificações
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
    }),
});

export default function App() {
    // Inicia notificações
    useEffect(() => {
        async function init() {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();

            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const { status } =
                    await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                console.warn("Permissão de notificação não concedida");
            }
        }

        init();
    }, []);

    return (
        <ThemeProvider>
            <Stack.Navigator initialRouteName="List">
                <Stack.Screen
                    name="List"
                    component={TaskListScreen}
                    options={{ title: "Tarefas" }}
                />

                <Stack.Screen name="Form" component={TaskFormScreen} />

                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{ title: "Opções" }}
                />
            </Stack.Navigator>
        </ThemeProvider>
    );
}
