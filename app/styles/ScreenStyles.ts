import { Platform, StyleSheet } from "react-native";

type Theme = "light" | "dark";

export const createStyles = (theme: Theme) => {
    const isDark = theme === "dark";

    const colors = {
        accent: "#0984e3",
        danger: "#e74c3c",
        success: "#27ae60",
        addBtnBg: "#0984e3",
        saveBtnBg: "#27ae60",
        filterActive: "#0984e3",
        saveBtnDisabledBg: "#9bd6a6",
        inputBg: isDark ? "#1e272e" : "#fff",
        cardBg: isDark ? "#2d3436" : "#f1f2f6",
        border: isDark ? "#2a2a2a" : "#e6e6e6",
        surface: isDark ? "#1e1e1e" : "#ffffff",
        filterBg: isDark ? "#2a2a2a" : "#eeeeee",
        background: isDark ? "#121212" : "#ffffff",
        textPrimary: isDark ? "#eeeeee" : "#222222",
        textSecondary: isDark ? "#bdbdbd" : "#666666",
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
                paddingHorizontal: 24,
                paddingVertical: 32,
                backgroundColor: colors.background,
            },
            row: {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
            },
            section: {
                marginBottom: 32,
            },
            label: {
                fontSize: 18,
                marginBottom: 12,
                color: colors.textPrimary,
                fontWeight: "600",
            },
            button: {
                backgroundColor: colors.addBtnBg,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                marginTop: 12,
                alignItems: "center",
            },
            importButton: {
                backgroundColor: colors.saveBtnBg,
            },
            buttonText: {
                color: colors.textPrimary,
                fontWeight: "600",
            },
            smallButton: {
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginLeft: 12,
            },
            filterRow: {
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
            },
            filterButton: {
                flex: 1,
                paddingVertical: 10,
                marginHorizontal: 4,
                borderRadius: 6,
                backgroundColor: colors.cardBg,
                alignItems: "center",
            },
            filterButtonActive: {
                backgroundColor: colors.accent,
            },
            filterText: {
                color: colors.textSecondary,
                fontWeight: "500",
            },
            filterTextActive: {
                color: colors.textPrimary,
                fontWeight: "700",
            },
            reminderRow: {
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
            },
            input: {
                flex: 1,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.textPrimary,
                backgroundColor: colors.inputBg,
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

        GamificationStyles: StyleSheet.create({
            // XpBar
            xpContainer: {
                width: "100%",
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: colors.surface,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 12,
            },
            xpRow: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            },
            xpLevelText: {
                fontSize: 14,
                fontWeight: "700",
                color: colors.textPrimary,
            },
            xpText: {
                fontSize: 12,
                color: colors.textSecondary,
            },
            xpBarWrap: {
                marginTop: 8,
                height: 10,
                borderRadius: 8,
                backgroundColor: colors.cardBg,
                overflow: "hidden",
            },
            xpBarFill: {
                height: "100%",
                backgroundColor: colors.accent,
                borderRadius: 8,
            },

            // LevelUp modal container
            levelModalOverlay: {
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20,
            },
            levelModalCard: {
                width: "100%",
                maxWidth: 360,
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
            },
            levelModalTitle: {
                fontSize: 20,
                fontWeight: "800",
                color: colors.textPrimary,
                marginBottom: 8,
            },
            levelModalSubtitle: {
                fontSize: 16,
                color: colors.textSecondary,
                marginBottom: 16,
                textAlign: "center",
            },
            levelRewardText: {
                fontSize: 14,
                color: colors.textPrimary,
                marginBottom: 16,
            },
            levelModalBtn: {
                backgroundColor: colors.accent,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                alignSelf: "stretch",
            },
            levelModalBtnText: {
                color: "#fff",
                fontWeight: "700",
                textAlign: "center",
            },
        }),
    };
};
