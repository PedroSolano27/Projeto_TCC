import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { createStyles } from "../styles/ScreenStyles";

type ButtonVariant = "primary" | "success" | "danger" | "secondary";

type Props = TouchableOpacityProps & {
    label: string;
    variant?: ButtonVariant;
    theme: "light" | "dark";
    disabled?: boolean;
};

export function Button({
    label,
    variant = "primary",
    theme,
    disabled,
    ...props
}: Props) {
    const { ButtonStyles } = createStyles(theme);
    const variantStyle = ButtonStyles[`btn_${variant}`];

    return (
        <TouchableOpacity
            {...props}
            disabled={disabled}
            style={[
                ButtonStyles.container,
                variantStyle,
                disabled && ButtonStyles.disabled,
            ]}
        >
            <Text style={ButtonStyles.text}>{label}</Text>
        </TouchableOpacity>
    );
}
