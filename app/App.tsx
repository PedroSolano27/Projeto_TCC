// App principal

// Terceiros
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Elementos
import TaskFormScreen from "./screens/TaskFormScreen";
import TaskListScreen from "./screens/TaskListScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Stack.Navigator initialRouteName="List">
            <Stack.Screen
                name="List"
                component={TaskListScreen}
                options={{ title: "Tarefas" }}
            />
            <Stack.Screen name="Form" component={TaskFormScreen} />
        </Stack.Navigator>
    );
}
