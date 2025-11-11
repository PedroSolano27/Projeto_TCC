import { Text, TextInput, TextInputProps, View } from "react-native";
import { createStyles } from "../styles/ScreenStyles";

type Props = TextInputProps & {
    label: string;
    error?: boolean;
    theme: "light" | "dark";
};

export function FormField({ label, error, theme, ...props }: Props) {
    const { FormFieldStyles } = createStyles(theme);

    return (
        <View style={FormFieldStyles.container}>
            <Text style={FormFieldStyles.label}>{label}</Text>
            <TextInput
                {...props}
                style={[
                    FormFieldStyles.input,
                    error && FormFieldStyles.inputError,
                ]}
            />
        </View>
    );
}
