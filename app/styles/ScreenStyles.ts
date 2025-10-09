import { Platform, StyleSheet } from "react-native";

type Theme = "light" | "dark";

export const createStyles = (theme: Theme) => {
    const isDark = theme === "dark";

    const colors = {
        background: isDark ? "#121212" : "#ffffff",
        surface: isDark ? "#1e1e1e" : "#ffffff",
        textPrimary: isDark ? "#eeeeee" : "#222222",
        textSecondary: isDark ? "#bdbdbd" : "#666666",
        border: isDark ? "#2a2a2a" : "#e6e6e6",
        accent: "#0984e3",
        success: "#27ae60",
        danger: "#e74c3c",
        filterBg: isDark ? "#2a2a2a" : "#eeeeee",
        filterActive: "#0984e3",
        addBtnBg: "#0984e3",
        saveBtnBg: "#27ae60",
        saveBtnDisabledBg: "#9bd6a6",
    };

    return {
        TaskListStyles: StyleSheet.create({
            container: {
                flex: 1,
                paddingTop: 40,
                paddingHorizontal: 16,
                backgroundColor: colors.background,
            },
            filterContainer: {
                flexDirection: "row",
                justifyContent: "space-around",
                marginBottom: 12,
            },
            header: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
            },
            title: {
                fontSize: 24,
                fontWeight: "600",
                color: colors.textPrimary,
            },
            addBtn: {
                backgroundColor: colors.addBtnBg,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
            },
            filterBtn: {
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 6,
                backgroundColor: colors.filterBg,
            },
            addText: { color: "#fff", fontWeight: "600" },
            filterText: {
                color: colors.textPrimary,
                fontWeight: "500",
            },
            empty: {
                textAlign: "center",
                marginTop: 40,
                color: colors.textSecondary,
            },
            filterActive: {
                backgroundColor: colors.filterActive,
            },
        }),

        TaskFormStyles: StyleSheet.create({
            container: {
                flex: 1,
                padding: 16,
                paddingTop: Platform.OS === "ios" ? 60 : 20,
                backgroundColor: colors.background,
            },
            label: {
                fontSize: 14,
                marginTop: 12,
                marginBottom: 6,
                color: colors.textPrimary,
            },
            input: {
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 10,
                backgroundColor: colors.surface,
                color: colors.textPrimary,
            },
            inputError: { borderColor: colors.danger },
            saveBtn: {
                marginTop: 20,
                backgroundColor: colors.saveBtnBg,
                padding: 14,
                borderRadius: 10,
                alignItems: "center",
            },
            dateBtn: {
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                backgroundColor: colors.surface,
                marginBottom: 10,
            },
            saveBtnDisabled: { backgroundColor: colors.saveBtnDisabledBg },
            saveText: { color: "#fff", fontWeight: "600" },
            dateText: {
                fontSize: 16,
                color: colors.textPrimary,
            },
        }),

        SettingsStyles: StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.background,
            },
            label: {
                fontSize: 18,
                marginBottom: 12,
                color: colors.textPrimary,
            },
        }),

        TaskStyles: StyleSheet.create({
            container: {
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                borderBottomWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.background,
            },
            left: { flexDirection: "row", alignItems: "center", flex: 1 },
            checkbox: {
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "#555",
                marginRight: 12,
            },
            checked: {
                backgroundColor: colors.success,
                borderColor: colors.success,
            },
            meta: { flex: 1 },
            title: { fontSize: 16, color: colors.textPrimary },
            completed: {
                textDecorationLine: "line-through",
                color: colors.textSecondary,
            },
            due: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
            actions: { flexDirection: "row" },
            actionBtn: { marginLeft: 8, padding: 8 },
            actionText: { color: colors.accent },
        }),
    };
};
