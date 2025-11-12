import { Text, View, ViewProps } from "react-native";

type Props = ViewProps & {
    label: string;
    theme: "light" | "dark";
    variant?: "primary" | "success" | "warning" | "danger" | "secondary";
    size?: "small" | "medium" | "large";
};

export function Badge({
    label,
    theme,
    variant = "secondary",
    size = "medium",
    ...props
}: Props) {
    const isDark = theme === "dark";

    const variants = {
        primary: isDark ? "#2196F3" : "#3B82F6",
        success: isDark ? "#22C55E" : "#16A34A",
        warning: isDark ? "#F59E0B" : "#D97706",
        danger: isDark ? "#EF4444" : "#DC2626",
        secondary: isDark ? "#6B7280" : "#9CA3AF",
    };

    const sizes = {
        small: { fontSize: 12, paddingVertical: 4, paddingHorizontal: 8 },
        medium: { fontSize: 14, paddingVertical: 6, paddingHorizontal: 12 },
        large: { fontSize: 16, paddingVertical: 8, paddingHorizontal: 16 },
    };

    const backgroundColor = variants[variant];
    const textColor = isDark ? "#FFFFFF" : "#FFFFFF";
    const sizeConfig = sizes[size];

    return (
        <View
            {...props}
            style={[
                {
                    backgroundColor,
                    borderRadius: 12,
                    paddingVertical: sizeConfig.paddingVertical,
                    paddingHorizontal: sizeConfig.paddingHorizontal,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "flex-start",
                },
                props.style,
            ]}
        >
            <Text
                style={{
                    color: textColor,
                    fontSize: sizeConfig.fontSize,
                    fontWeight: "600",
                }}
            >
                {label}
            </Text>
        </View>
    );
}
