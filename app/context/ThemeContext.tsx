// Contexto para opções

// Terceiros
import { createContext, ReactNode, useContext, useState } from "react";
import { Appearance } from "react-native";

type Theme = "light" | "dark";

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

// Contexto
const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => {},
});

// Exporta hook
export const useTheme = () => useContext(ThemeContext);

// Provedor de Contexto
export function ThemeProvider({ children }: { children: ReactNode }) {
    const systemTheme = Appearance.getColorScheme() ?? "light";
    const [theme, setTheme] = useState<Theme>(systemTheme);

    // Troca o tema
    function toggleTheme() {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
