// App principal

// Terceiros
import { enableScreens } from "react-native-screens";

// Elementos
import AppNavigator from "./navigator/AppNavigator";

enableScreens();

export default function App() {
    return <AppNavigator />;
}
