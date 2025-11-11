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
            formGroup: {
                marginBottom: 12,
            },
            label: {
                fontSize: 14,
                marginTop: 12,
                marginBottom: 6,
                color: colors.textPrimary,
                fontWeight: "600",
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

        FormFieldStyles: StyleSheet.create({
            container: {
                marginBottom: 12,
            },
            label: {
                fontSize: 14,
                marginBottom: 6,
                color: colors.textPrimary,
                fontWeight: "600",
            },
            input: {
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 10,
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontSize: 14,
            },
            inputError: {
                borderColor: colors.danger,
            },
        }),

        ButtonStyles: StyleSheet.create({
            container: {
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                marginVertical: 8,
            },
            btn_primary: {
                backgroundColor: colors.accent,
            },
            btn_success: {
                backgroundColor: colors.success,
            },
            btn_danger: {
                backgroundColor: colors.danger,
            },
            btn_secondary: {
                backgroundColor: colors.cardBg,
            },
            disabled: {
                opacity: 0.5,
            },
            text: {
                color: "#fff",
                fontWeight: "600",
                fontSize: 14,
            },
        }),

        CardStyles: StyleSheet.create({
            container: {
                backgroundColor: colors.cardBg,
                borderRadius: 10,
                padding: 12,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 12,
            },
        }),

        TagSelectorStyles: StyleSheet.create({
            container: {
                marginBottom: 12,
            },
            label: {
                fontSize: 14,
                marginBottom: 6,
                color: colors.textPrimary,
                fontWeight: "600",
            },
            trigger: {
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                backgroundColor: colors.surface,
            },
            triggerText: {
                color: colors.textPrimary,
                fontSize: 14,
            },
            overlay: {
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20,
            },
            modal: {
                width: "100%",
                maxWidth: 400,
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                maxHeight: "80%",
            },
            modalTitle: {
                fontSize: 16,
                fontWeight: "700",
                color: colors.textPrimary,
                marginBottom: 12,
            },
            optionsList: {
                maxHeight: 300,
            },
            option: {
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
            },
            optionSelected: {
                backgroundColor: colors.cardBg,
            },
            optionLabel: {
                fontSize: 14,
                fontWeight: "600",
                color: colors.textPrimary,
            },
            optionDescription: {
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 4,
            },
            optionRewards: {
                fontSize: 11,
                color: colors.accent,
                fontWeight: "500",
                marginTop: 4,
            },
        }),

        TimeSelectorStyles: StyleSheet.create({
            container: {
                marginBottom: 12,
            },
            label: {
                fontSize: 14,
                marginBottom: 6,
                color: colors.textPrimary,
                fontWeight: "600",
            },
            trigger: {
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                backgroundColor: colors.surface,
            },
            triggerText: {
                color: colors.textPrimary,
                fontSize: 14,
            },
            overlay: {
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20,
            },
            modal: {
                width: "100%",
                maxWidth: 360,
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                maxHeight: "80%",
            },
            modalTitle: {
                fontSize: 16,
                fontWeight: "700",
                color: colors.textPrimary,
                marginBottom: 4,
            },
            modalSubtitle: {
                fontSize: 12,
                color: colors.textSecondary,
                marginBottom: 12,
            },
            optionsList: {
                maxHeight: 300,
            },
            option: {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
            },
            optionSelected: {
                backgroundColor: colors.cardBg,
            },
            checkbox: {
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: colors.accent,
                marginRight: 12,
                justifyContent: "center",
                alignItems: "center",
            },
            checkmark: {
                color: colors.accent,
                fontWeight: "700",
                fontSize: 12,
            },
            optionLabel: {
                fontSize: 14,
                color: colors.textPrimary,
                flex: 1,
            },
            closeBtn: {
                backgroundColor: colors.accent,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 12,
            },
            closeBtnText: {
                color: "#fff",
                fontWeight: "600",
                fontSize: 14,
            },
        }),

        DashboardStyles: StyleSheet.create({
            profileSection: {
                padding: 16,
                backgroundColor: isDark ? "#1f1f1f" : "#f5f5f5",
                marginBottom: 16,
            },
            sectionTitle: {
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 12,
                color: colors.textPrimary,
            },
            profileCard: {
                marginBottom: 12,
                padding: 12,
                backgroundColor: colors.surface,
                borderRadius: 8,
            },
            profileRow: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            },
            profileColumn: {
                alignItems: "flex-end",
            },
            profileLabel: {
                fontSize: 14,
                color: colors.textSecondary,
            },
            profileValue: {
                fontSize: 28,
                fontWeight: "bold",
                color: colors.textPrimary,
            },
            xpContainer: {
                marginTop: 12,
            },
            xpLabel: {
                fontSize: 12,
                color: colors.textSecondary,
                marginBottom: 4,
            },
            xpBar: {
                height: 8,
                backgroundColor: isDark ? "#404040" : "#e0e0e0",
                borderRadius: 4,
                overflow: "hidden",
            },
            xpFill: {
                height: "100%",
                backgroundColor: "#4CAF50",
            },
            xpText: {
                fontSize: 11,
                color: colors.textSecondary,
                marginTop: 4,
            },
            streakCard: {
                padding: 12,
                backgroundColor: colors.surface,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
            },
            streakIcon: {
                marginRight: 8,
            },
            streakLabel: {
                fontSize: 14,
                color: colors.textSecondary,
            },
            streakValue: {
                fontSize: 18,
                fontWeight: "bold",
                color: colors.textPrimary,
            },
            statsSection: {
                padding: 16,
                backgroundColor: isDark ? "#1f1f1f" : "#f5f5f5",
                marginBottom: 16,
            },
            statsTitle: {
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
                color: colors.textPrimary,
            },
            statsRow: {
                flexDirection: "row",
                justifyContent: "space-between",
            },
            statCard: {
                flex: 1,
                padding: 12,
                backgroundColor: colors.surface,
                borderRadius: 8,
                marginRight: 8,
                alignItems: "center",
            },
            statCardLast: {
                marginRight: 0,
            },
            statIcon: {
                marginBottom: 8,
            },
            statLabel: {
                fontSize: 12,
                color: colors.textSecondary,
            },
            statValue: {
                fontSize: 20,
                fontWeight: "bold",
                color: colors.textPrimary,
            },
            badgesSection: {
                padding: 16,
                backgroundColor: isDark ? "#1f1f1f" : "#f5f5f5",
                marginBottom: 16,
            },
            badgesTitle: {
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
                color: colors.textPrimary,
            },
            badgesContainer: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-around",
            },
            badgeItem: {
                width: "30%",
                padding: 12,
                backgroundColor: colors.surface,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 12,
            },
            badgeIcon: {
                marginBottom: 4,
            },
            badgeTitle: {
                fontSize: 12,
                fontWeight: "bold",
                textAlign: "center",
                color: colors.textPrimary,
            },
            badgeDescription: {
                fontSize: 10,
                color: isDark ? "#666" : "#999",
                textAlign: "center",
                marginTop: 4,
            },
            recentSection: {
                padding: 16,
                backgroundColor: isDark ? "#1f1f1f" : "#f5f5f5",
                marginBottom: 16,
            },
            recentTitle: {
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
                color: colors.textPrimary,
            },
            recentItem: {
                padding: 12,
                backgroundColor: colors.surface,
                borderRadius: 8,
                marginBottom: 8,
                borderLeftWidth: 4,
                borderLeftColor: "#4CAF50",
            },
            recentItemTitle: {
                fontSize: 14,
                fontWeight: "500",
                marginBottom: 4,
                color: colors.textPrimary,
            },
            recentItemDate: {
                fontSize: 12,
                color: colors.textSecondary,
            },
        }),
    };
};
