import { View, ViewProps } from "react-native";

type Props = ViewProps & {
    theme: "light" | "dark";
    variant?: "small" | "medium" | "large";
};

export function Separator({ theme, variant = "medium", ...props }: Props) {
    const isDark = theme === "dark";

    const heights = {
        small: 1,
        medium: 2,
        large: 4,
    };

    const colors = {
        light: "#E5E7EB",
        dark: "#374151",
    };

    const color = isDark ? colors.dark : colors.light;

    return (
        <View
            {...props}
            style={[
                {
                    height: heights[variant],
                    backgroundColor: color,
                },
                props.style,
            ]}
        />
    );
}
