// App principal

// Tipos
import { RootStackParamList } from "./types/StackParamList";

// Terceiros
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import { ThemeProvider } from "./context/ThemeContext";

// Elementos
import SettingsScreen from "./screens/SettingsScreen";
import TaskFormScreen from "./screens/TaskFormScreen";
import TaskListScreen from "./screens/TaskListScreen";

enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
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
