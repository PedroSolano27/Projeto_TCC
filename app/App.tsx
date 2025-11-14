import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { enableScreens } from "react-native-screens";
import { SettingsProvider } from "./context/SettingsContext";
import DashboardScreen from "./screens/DashboardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import TaskFormScreen from "./screens/TaskFormScreen";
import TaskListScreen from "./screens/TaskListScreen";
import { RootStackParamList } from "./types/StackParamList";

enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function App() {
    useEffect(() => {
        const initNotifications = async () => {
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
                return;
            }

            const subscription =
                Notifications.addNotificationResponseReceivedListener(
                    (response) => {
                        console.log(
                            "Notificação tocada:",
                            response.notification,
                        );
                    },
                );

            return () => {
                subscription.remove();
            };
        };

        initNotifications();
    }, []);

    return (
        <NavigationContainer>
            <SettingsProvider>
                <Stack.Navigator initialRouteName="List">
                    <Stack.Screen
                        name="List"
                        component={TaskListScreen}
                        options={{ title: "Tarefas" }}
                    />

                    <Stack.Screen
                        name="Dashboard"
                        component={DashboardScreen}
                        options={{ title: "Progresso" }}
                    />

                    <Stack.Screen name="Form" component={TaskFormScreen} />

                    <Stack.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{ title: "Opções" }}
                    />
                </Stack.Navigator>
            </SettingsProvider>
        </NavigationContainer>
    );
}
