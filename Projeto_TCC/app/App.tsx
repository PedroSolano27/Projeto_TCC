// App principal

// Terceiros
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Elementos
import TaskListScreen from "./screens/TaskListScreen";
import TaskFormScreen from "./screens/TaskFormScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="List">
                <Stack.Screen
                    name="List"
                    component={TaskListScreen}
                    options={{ title: "Tarefas" }}
                />
                <Stack.Screen name="Form" component={TaskFormScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
