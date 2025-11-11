import React from "react";
import { View, ViewProps } from "react-native";
import { createStyles } from "../styles/ScreenStyles";

type Props = ViewProps & {
    theme: "light" | "dark";
    children?: React.ReactNode;
};

export function Card({ theme, children, ...props }: Props) {
    const { CardStyles } = createStyles(theme);

    return (
        <View {...props} style={[CardStyles.container, props.style]}>
            {children}
        </View>
    );
}
