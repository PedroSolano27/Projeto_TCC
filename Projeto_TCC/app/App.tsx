// App principal

// Terceiros
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Elementos
import HomeScreen from "./screens/HomeScreen";
import TaskScreen from "./screens/TaskScreen";
import StatsScreen from "./screens/StatsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Início" component={HomeScreen} />
                <Tab.Screen name="Tarefas" component={TaskScreen} />
                <Tab.Screen name="Progresso" component={StatsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
