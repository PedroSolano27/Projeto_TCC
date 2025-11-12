import {
    Feather,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import {
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";

type IconLibrary = "feather" | "material" | "materialCommunity";

type Props = TouchableOpacityProps & {
    name: string;
    size?: number;
    color?: string;
    library?: IconLibrary;
    theme?: "light" | "dark";
    variant?: "default" | "primary" | "success" | "danger" | "warning";
    disabled?: boolean;
    accessible?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
};

const getVariantColor = (
    variant: Props["variant"],
    theme: "light" | "dark",
): string => {
    const colorMap = {
        light: {
            default: "#6B7280",
            primary: "#3B82F6",
            success: "#22C55E",
            danger: "#EF4444",
            warning: "#F59E0B",
        },
        dark: {
            default: "#D1D5DB",
            primary: "#60A5FA",
            success: "#34D399",
            danger: "#F87171",
            warning: "#FBBF24",
        },
    };

    return colorMap[theme][variant || "default"];
};

export function IconButton({
    name,
    size = 24,
    color,
    library = "feather",
    theme = "dark",
    variant = "default",
    disabled = false,
    accessible = true,
    accessibilityLabel,
    accessibilityHint,
    ...props
}: Props) {
    const IconComponent =
        library === "feather"
            ? Feather
            : library === "material"
              ? MaterialIcons
              : MaterialCommunityIcons;

    const iconColor = color || getVariantColor(variant, theme);
    const opacity = disabled ? 0.5 : 1;

    const containerStyle: ViewStyle = {
        minWidth: 44,
        minHeight: 44,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    };

    return (
        <TouchableOpacity
            {...props}
            disabled={disabled}
            accessible={accessible}
            accessibilityLabel={accessibilityLabel || `${name} button`}
            accessibilityHint={accessibilityHint}
            accessibilityRole="button"
            style={[containerStyle, { opacity }, props.style]}
        >
            <IconComponent name={name as any} size={size} color={iconColor} />
        </TouchableOpacity>
    );
}
