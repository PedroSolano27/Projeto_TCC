import { Platform, StyleSheet } from "react-native";
import {
    BorderRadius,
    ColorPalette,
    Shadows,
    Spacing,
    Typography,
} from "./DesignTokens";

type Theme = "light" | "dark";

export const createStyles = (theme: Theme) => {
    const isDark = theme === "dark";
    const colors = isDark ? ColorPalette.dark : ColorPalette.light;

    return {
        TaskListStyles: StyleSheet.create({
            container: {
                flex: 1,
                paddingTop: Platform.OS === "ios" ? 50 : 16,
                paddingHorizontal: Spacing[4],
                backgroundColor: colors.background,
            },
            // Cabeçalho
            header: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: Spacing[4],
                paddingVertical: Spacing[3],
            },
            title: {
                fontSize: Typography.fontSize["2xl"],
                fontWeight: Typography.fontWeight.bold,
                color: colors.textPrimary,
                flex: 1,
            },
            // Botões de navegação
            headerButton: {
                paddingHorizontal: Spacing[3],
                paddingVertical: Spacing[2],
                marginLeft: Spacing[2],
                backgroundColor: colors.primary[600],
                borderRadius: BorderRadius.md,
                minHeight: 40,
                minWidth: 40,
                justifyContent: "center",
                alignItems: "center",
                ...Shadows.sm,
            },
            headerButtonText: {
                color: "#FFFFFF",
                fontWeight: Typography.fontWeight.semibold,
                fontSize: Typography.fontSize.sm,
            },
            // Container de filtro
            filterContainer: {
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: Spacing[2],
                marginBottom: Spacing[4],
                paddingVertical: Spacing[2],
                overflow: "scroll",
            },
            filterBtn: {
                paddingVertical: Spacing[2],
                paddingHorizontal: Spacing[3],
                borderRadius: BorderRadius.lg,
                backgroundColor: colors.surfaceHovered,
                borderWidth: 1.5,
                borderColor: colors.border,
                minHeight: 40,
                justifyContent: "center",
                alignItems: "center",
            },
            filterBtnActive: {
                backgroundColor: colors.primary[600],
                borderColor: colors.primary[600],
            },
            filterText: {
                color: colors.textSecondary,
                fontWeight: Typography.fontWeight.medium,
                fontSize: Typography.fontSize.sm,
            },
            filterTextActive: {
                color: "#FFFFFF",
                fontWeight: Typography.fontWeight.semibold,
            },
            // Lista de tarefas
            listContent: {
                paddingBottom: Spacing[4],
            },
            empty: {
                textAlign: "center",
                marginTop: Spacing[12],
                color: colors.textTertiary,
                fontSize: Typography.fontSize.base,
            },
            emptyIcon: {
                fontSize: 64,
                marginBottom: Spacing[3],
            },
        }),

        TaskFormStyles: StyleSheet.create({
            container: {
                flex: 1,
                paddingTop: Platform.OS === "ios" ? 60 : 20,
                paddingHorizontal: Spacing[4],
                backgroundColor: colors.background,
            },
            scrollContent: {
                paddingBottom: Spacing[6] + Spacing[20],
            },
            // Agrupamento de seção
            section: {
                marginBottom: Spacing[6],
            },
            sectionTitle: {
                fontSize: Typography.fontSize.lg,
                fontWeight: Typography.fontWeight.semibold,
                color: colors.textPrimary,
                marginBottom: Spacing[3],
                marginTop: Spacing[4],
                textTransform: "uppercase",
                letterSpacing: 0.5,
            },
            // Agrupamento de formulários
            formGroup: {
                marginBottom: Spacing[4],
            },
            label: {
                fontSize: Typography.fontSize.sm,
                marginBottom: Spacing[2],
                color: colors.textPrimary,
                fontWeight: Typography.fontWeight.semibold,
            },
            hint: {
                fontSize: Typography.fontSize.xs,
                color: colors.textSecondary,
                marginBottom: Spacing[2],
                fontStyle: "italic",
            },
            // Inputs
            input: {
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: BorderRadius.md,
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[4],
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontSize: Typography.fontSize.base,
                minHeight: 44,
                ...Shadows.xs,
            },
            inputFocused: {
                borderColor: colors.primary[600],
                borderWidth: 2,
            },
            inputError: {
                borderColor: colors.danger[600],
            },
            textAreaInput: {
                height: 100,
                textAlignVertical: "top",
            },
            // Botões
            buttonRow: {
                flexDirection: "row",
                gap: Spacing[3],
                marginTop: Spacing[4],
            },
            saveBtn: {
                flex: 1,
                backgroundColor: colors.success[500],
                paddingVertical: Spacing[3],
                borderRadius: BorderRadius.md,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 48,
                ...Shadows.sm,
            },
            saveBtnDisabled: {
                backgroundColor: colors.neutral[400],
                opacity: 0.6,
            },
            cancelBtn: {
                flex: 1,
                backgroundColor: colors.neutral[200],
                paddingVertical: Spacing[3],
                borderRadius: BorderRadius.md,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 48,
                ...Shadows.sm,
            },
            buttonText: {
                color: "#FFFFFF",
                fontWeight: Typography.fontWeight.semibold,
                fontSize: Typography.fontSize.base,
            },
            cancelButtonText: {
                color: colors.textPrimary,
                fontWeight: Typography.fontWeight.semibold,
                fontSize: Typography.fontSize.base,
            },
            // Seletor de data
            dateBtn: {
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: BorderRadius.md,
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[4],
                backgroundColor: colors.surface,
                marginBottom: Spacing[3],
                minHeight: 44,
                justifyContent: "center",
                ...Shadows.xs,
            },
            dateText: {
                fontSize: Typography.fontSize.base,
                color: colors.textPrimary,
                fontWeight: Typography.fontWeight.medium,
            },
        }),

        SettingsStyles: StyleSheet.create({
            container: {
                flex: 1,
                paddingHorizontal: Spacing[4],
                paddingVertical: Spacing[4],
                paddingTop: Platform.OS === "ios" ? 60 : 20,
                backgroundColor: colors.background,
            },
            scrollContent: {
                paddingBottom: Spacing[6] + Spacing[20],
            },
            // Seção de configurações
            section: {
                marginBottom: Spacing[6],
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.lg,
                padding: Spacing[4],
                borderWidth: 1,
                borderColor: colors.border,
                ...Shadows.sm,
            },
            sectionTitle: {
                fontSize: Typography.fontSize.lg,
                fontWeight: Typography.fontWeight.bold,
                color: colors.textPrimary,
                marginBottom: Spacing[3],
            },
            // Linha de configurações
            row: {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: Spacing[3],
                borderBottomWidth: 1,
                borderBottomColor: colors.divider,
            },
            rowLast: {
                borderBottomWidth: 0,
            },
            label: {
                fontSize: Typography.fontSize.base,
                color: colors.textPrimary,
                fontWeight: Typography.fontWeight.medium,
                flex: 1,
            },
            description: {
                fontSize: Typography.fontSize.xs,
                color: colors.textSecondary,
                marginTop: Spacing[1],
            },
            // Botões de filtro
            filterRow: {
                flexDirection: "row",
                gap: Spacing[2],
                marginTop: Spacing[3],
            },
            filterButton: {
                flex: 1,
                paddingVertical: Spacing[3],
                borderRadius: BorderRadius.md,
                backgroundColor: colors.surfaceHovered,
                borderWidth: 1.5,
                borderColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
            },
            filterButtonActive: {
                backgroundColor: colors.primary[600],
                borderColor: colors.primary[600],
            },
            filterText: {
                color: colors.textSecondary,
                fontWeight: Typography.fontWeight.medium,
                fontSize: Typography.fontSize.sm,
            },
            filterTextActive: {
                color: "#FFFFFF",
                fontWeight: Typography.fontWeight.semibold,
            },
            // Botões
            button: {
                backgroundColor: colors.primary[600],
                paddingHorizontal: Spacing[4],
                paddingVertical: Spacing[3],
                borderRadius: BorderRadius.md,
                marginTop: Spacing[3],
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                ...Shadows.sm,
            },
            buttonSuccess: {
                backgroundColor: colors.success[500],
            },
            buttonDanger: {
                backgroundColor: colors.danger[600],
            },
            buttonText: {
                color: "#FFFFFF",
                fontWeight: Typography.fontWeight.semibold,
                fontSize: Typography.fontSize.base,
            },
        }),

        TaskStyles: StyleSheet.create({
            container: {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[3],
                marginBottom: Spacing[2],
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.md,
                borderWidth: 1,
                borderColor: colors.border,
                ...Shadows.xs,
            },
            // Lado esquerdo
            left: {
                flexDirection: "row",
                alignItems: "flex-start",
                flex: 1,
            },
            // Checkbox
            checkbox: {
                width: 24,
                height: 24,
                borderRadius: BorderRadius.base,
                borderWidth: 2,
                borderColor: colors.primary[600],
                marginRight: Spacing[3],
                marginTop: Spacing[1],
                justifyContent: "center",
                alignItems: "center",
            },
            checked: {
                backgroundColor: colors.success[500],
                borderColor: colors.success[500],
            },
            checkmark: {
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: Typography.fontWeight.bold,
            },
            // Metadata de tarefas
            meta: {
                flex: 1,
            },
            title: {
                fontSize: Typography.fontSize.base,
                color: colors.textPrimary,
                fontWeight: Typography.fontWeight.medium,
                marginBottom: Spacing[1],
            },
            titleCompleted: {
                textDecorationLine: "line-through",
                color: colors.textSecondary,
            },
            due: {
                fontSize: Typography.fontSize.xs,
                color: colors.textTertiary,
                marginBottom: Spacing[1],
            },
            tag: {
                fontSize: Typography.fontSize.xs,
                color: colors.primary[600],
                fontWeight: Typography.fontWeight.semibold,
                marginTop: Spacing[1],
            },
            // Lado direito
            actions: {
                flexDirection: "row",
                gap: Spacing[1],
            },
            actionBtn: {
                padding: Spacing[2],
            },
            actionText: {
                color: colors.primary[600],
                fontSize: Typography.fontSize.xs,
                fontWeight: Typography.fontWeight.semibold,
            },
            actionTextDanger: {
                color: colors.danger[600],
            },
        }),

        GamificationStyles: StyleSheet.create({
            // Container de XP
            xpContainer: {
                width: "100%",
                paddingHorizontal: Spacing[4],
                paddingVertical: Spacing[3],
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.lg,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: Spacing[4],
                ...Shadows.sm,
            },
            xpRow: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: Spacing[3],
            },
            xpLevelText: {
                fontSize: Typography.fontSize.lg,
                fontWeight: Typography.fontWeight.bold,
                color: colors.textPrimary,
            },
            xpText: {
                fontSize: Typography.fontSize.sm,
                color: colors.textSecondary,
                fontWeight: Typography.fontWeight.medium,
            },
            xpBarWrap: {
                height: 12,
                borderRadius: BorderRadius.full,
                backgroundColor: colors.neutral[200],
                overflow: "hidden",
                ...Shadows.xs,
            },
            xpBarFill: {
                height: "100%",
                backgroundColor: colors.primary[600],
                borderRadius: BorderRadius.full,
            },

            // Modal de Level-up
            levelModalOverlay: {
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.6)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: Spacing[4],
            },
            levelModalCard: {
                width: "100%",
                maxWidth: 360,
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.xl,
                paddingVertical: Spacing[6],
                paddingHorizontal: Spacing[4],
                borderWidth: 2,
                borderColor: colors.primary[600],
                alignItems: "center",
                ...Shadows.lg,
            },
            levelModalTitle: {
                fontSize: Typography.fontSize["3xl"],
                fontWeight: Typography.fontWeight.bold,
                color: colors.primary[600],
                marginBottom: Spacing[2],
            },
            levelModalLevel: {
                fontSize: Typography.fontSize["2xl"],
                fontWeight: Typography.fontWeight.extrabold,
                color: colors.textPrimary,
                marginBottom: Spacing[3],
            },
            levelModalSubtitle: {
                fontSize: Typography.fontSize.base,
                color: colors.textSecondary,
                marginBottom: Spacing[4],
                textAlign: "center",
            },
            levelRewardText: {
                fontSize: Typography.fontSize.base,
                color: colors.success[500],
                fontWeight: Typography.fontWeight.semibold,
                marginBottom: Spacing[4],
                textAlign: "center",
            },
            levelModalBtn: {
                width: "100%",
                backgroundColor: colors.primary[600],
                paddingVertical: Spacing[3],
                borderRadius: BorderRadius.md,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 48,
                ...Shadows.sm,
            },
            levelModalBtnText: {
                color: "#FFFFFF",
                fontWeight: Typography.fontWeight.bold,
                fontSize: Typography.fontSize.base,
            },
        }),

        FormFieldStyles: StyleSheet.create({
            container: {
                marginBottom: Spacing[4],
            },
            label: {
                fontSize: Typography.fontSize.sm,
                marginBottom: Spacing[2],
                color: colors.textPrimary,
                fontWeight: Typography.fontWeight.semibold,
            },
            hint: {
                fontSize: Typography.fontSize.xs,
                color: colors.textSecondary,
                marginBottom: Spacing[2],
            },
            input: {
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: BorderRadius.md,
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[4],
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontSize: Typography.fontSize.base,
                minHeight: 44,
            },
            inputFocused: {
                borderColor: colors.primary[600],
                borderWidth: 2,
            },
            inputError: {
                borderColor: colors.danger[600],
            },
            errorText: {
                fontSize: Typography.fontSize.xs,
                color: colors.danger[600],
                marginTop: Spacing[1],
                fontWeight: Typography.fontWeight.medium,
            },
        }),

        ButtonStyles: StyleSheet.create({
            container: {
                paddingHorizontal: Spacing[4],
                paddingVertical: Spacing[3],
                borderRadius: BorderRadius.md,
                alignItems: "center",
                justifyContent: "center",
                marginVertical: Spacing[2],
                minHeight: 48,
                minWidth: 48,
                flexDirection: "row",
                ...Shadows.sm,
            },
            // Variantes de botão
            btn_primary: {
                backgroundColor: colors.primary[600],
            },
            btn_success: {
                backgroundColor: colors.success[500],
            },
            btn_danger: {
                backgroundColor: colors.danger[600],
            },
            btn_secondary: {
                backgroundColor: colors.neutral[200],
            },
            // Desabilitado
            disabled: {
                opacity: 0.6,
            },
            // Texto
            text: {
                color: "#FFFFFF",
                fontWeight: Typography.fontWeight.semibold,
                fontSize: Typography.fontSize.base,
            },
            textSecondary: {
                color: colors.textPrimary,
            },
        }),

        CardStyles: StyleSheet.create({
            container: {
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.lg,
                paddingVertical: Spacing[4],
                paddingHorizontal: Spacing[4],
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: Spacing[3],
                ...Shadows.sm,
            },
            elevated: {
                ...Shadows.md,
            },
        }),

        TagSelectorStyles: StyleSheet.create({
            container: {
                marginBottom: Spacing[4],
            },
            label: {
                fontSize: Typography.fontSize.sm,
                marginBottom: Spacing[2],
                color: colors.textPrimary,
                fontWeight: Typography.fontWeight.semibold,
            },
            trigger: {
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: BorderRadius.md,
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[4],
                backgroundColor: colors.surface,
                minHeight: 44,
                justifyContent: "center",
                ...Shadows.xs,
            },
            triggerText: {
                color: colors.textPrimary,
                fontSize: Typography.fontSize.base,
                fontWeight: Typography.fontWeight.medium,
            },
            // Modal
            overlay: {
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: Spacing[4],
            },
            modal: {
                width: "100%",
                maxWidth: 400,
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.xl,
                padding: Spacing[4],
                maxHeight: "80%",
                ...Shadows.lg,
            },
            modalTitle: {
                fontSize: Typography.fontSize.lg,
                fontWeight: Typography.fontWeight.bold,
                color: colors.textPrimary,
                marginBottom: Spacing[4],
            },
            optionsList: {
                maxHeight: 300,
            },
            option: {
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[3],
                borderBottomWidth: 1,
                borderBottomColor: colors.divider,
                flexDirection: "row",
                alignItems: "center",
            },
            optionSelected: {
                backgroundColor: colors.surfaceHovered,
            },
            optionCheckbox: {
                width: 20,
                height: 20,
                borderRadius: BorderRadius.base,
                borderWidth: 2,
                borderColor: colors.primary[600],
                marginRight: Spacing[3],
                justifyContent: "center",
                alignItems: "center",
            },
            optionCheckboxChecked: {
                backgroundColor: colors.primary[600],
            },
            optionCheckmark: {
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: Typography.fontWeight.bold,
            },
            optionContent: {
                flex: 1,
            },
            optionLabel: {
                fontSize: Typography.fontSize.base,
                fontWeight: Typography.fontWeight.semibold,
                color: colors.textPrimary,
            },
            optionDescription: {
                fontSize: Typography.fontSize.xs,
                color: colors.textSecondary,
                marginTop: Spacing[1],
            },
            optionRewards: {
                fontSize: Typography.fontSize.xs,
                color: colors.primary[600],
                fontWeight: Typography.fontWeight.semibold,
                marginTop: Spacing[1],
            },
            closeBtn: {
                backgroundColor: colors.primary[600],
                paddingVertical: Spacing[3],
                borderRadius: BorderRadius.md,
                alignItems: "center",
                marginTop: Spacing[3],
                minHeight: 44,
                ...Shadows.sm,
            },
            closeBtnText: {
                color: "#FFFFFF",
                fontWeight: Typography.fontWeight.semibold,
                fontSize: Typography.fontSize.base,
            },
        }),

        TimeSelectorStyles: StyleSheet.create({
            container: {
                marginBottom: Spacing[4],
            },
            label: {
                fontSize: Typography.fontSize.sm,
                marginBottom: Spacing[2],
                color: colors.textPrimary,
                fontWeight: Typography.fontWeight.semibold,
            },
            trigger: {
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: BorderRadius.md,
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[4],
                backgroundColor: colors.surface,
                minHeight: 44,
                justifyContent: "center",
                ...Shadows.xs,
            },
            triggerText: {
                color: colors.textPrimary,
                fontSize: Typography.fontSize.base,
                fontWeight: Typography.fontWeight.medium,
            },
            // Modal
            overlay: {
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: Spacing[4],
            },
            modal: {
                width: "100%",
                maxWidth: 360,
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.xl,
                padding: Spacing[4],
                maxHeight: "80%",
                ...Shadows.lg,
            },
            modalTitle: {
                fontSize: Typography.fontSize.lg,
                fontWeight: Typography.fontWeight.bold,
                color: colors.textPrimary,
                marginBottom: Spacing[1],
            },
            modalSubtitle: {
                fontSize: Typography.fontSize.sm,
                color: colors.textSecondary,
                marginBottom: Spacing[4],
            },
            optionsList: {
                maxHeight: 300,
            },
            option: {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[3],
                borderBottomWidth: 1,
                borderBottomColor: colors.divider,
            },
            optionSelected: {
                backgroundColor: colors.surfaceHovered,
            },
            checkbox: {
                width: 20,
                height: 20,
                borderRadius: BorderRadius.base,
                borderWidth: 2,
                borderColor: colors.primary[600],
                marginRight: Spacing[3],
                justifyContent: "center",
                alignItems: "center",
            },
            checkboxChecked: {
                backgroundColor: colors.primary[600],
            },
            checkmark: {
                color: colors.textPrimary,
                fontWeight: Typography.fontWeight.bold,
                fontSize: 12,
            },
            optionLabel: {
                fontSize: Typography.fontSize.base,
                color: colors.textPrimary,
                flex: 1,
                fontWeight: Typography.fontWeight.medium,
            },
            closeBtn: {
                backgroundColor: colors.primary[600],
                paddingVertical: Spacing[3],
                borderRadius: BorderRadius.md,
                alignItems: "center",
                marginTop: Spacing[3],
                minHeight: 44,
                ...Shadows.sm,
            },
            closeBtnText: {
                color: "#FFFFFF",
                fontWeight: Typography.fontWeight.semibold,
                fontSize: Typography.fontSize.base,
            },
        }),

        HourMinuteSelectorStyles: StyleSheet.create({
            trigger: {
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: BorderRadius.md,
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[4],
                backgroundColor: colors.surface,
                minHeight: 44,
                justifyContent: "center",
                marginBottom: Spacing[4],
                ...Shadows.xs,
            },
            triggerText: {
                color: colors.textPrimary,
                fontSize: Typography.fontSize.base,
                fontWeight: Typography.fontWeight.medium,
            },
            overlay: {
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: Spacing[4],
            },
            modal: {
                width: "100%",
                maxWidth: 360,
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.xl,
                padding: Spacing[4],
                ...Shadows.lg,
            },
            modalTitle: {
                fontSize: Typography.fontSize.lg,
                fontWeight: Typography.fontWeight.bold,
                color: colors.textPrimary,
                marginBottom: Spacing[1],
            },
            modalSubtitle: {
                fontSize: Typography.fontSize.sm,
                color: colors.textSecondary,
                marginBottom: Spacing[4],
            },
            inputContainer: {
                flexDirection: "row",
                alignItems: "center",
                marginBottom: Spacing[4],
                justifyContent: "space-between",
                paddingHorizontal: Spacing[2],
            },
            inputGroup: {
                flex: 1,
                alignItems: "center",
            },
            label: {
                fontSize: Typography.fontSize.sm,
                fontWeight: Typography.fontWeight.semibold,
                color: colors.textPrimary,
                marginBottom: Spacing[2],
            },
            input: {
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: BorderRadius.md,
                paddingVertical: Spacing[2],
                paddingHorizontal: Spacing[3],
                fontSize: Typography.fontSize.lg,
                fontWeight: Typography.fontWeight.bold,
                color: colors.textPrimary,
                backgroundColor: colors.background,
                textAlign: "center",
                minWidth: 70,
                minHeight: 44,
            },
            unit: {
                fontSize: Typography.fontSize.xs,
                color: colors.textSecondary,
                marginTop: Spacing[1],
                fontWeight: Typography.fontWeight.medium,
            },
            separator: {
                width: 40,
                height: 2,
                backgroundColor: colors.divider,
                marginHorizontal: Spacing[2],
            },
            buttonContainer: {
                flexDirection: "row",
                gap: Spacing[3],
                justifyContent: "space-between",
            },
            button: {
                flex: 1,
                paddingVertical: Spacing[3],
                borderRadius: BorderRadius.md,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                ...Shadows.sm,
            },
            cancelBtn: {
                backgroundColor: colors.surfaceHovered,
                borderWidth: 1.5,
                borderColor: colors.border,
            },
            cancelBtnText: {
                color: colors.textPrimary,
                fontWeight: Typography.fontWeight.semibold,
                fontSize: Typography.fontSize.base,
            },
            confirmBtn: {
                backgroundColor: colors.primary[600],
            },
            confirmBtnText: {
                color: "#FFFFFF",
                fontWeight: Typography.fontWeight.semibold,
                fontSize: Typography.fontSize.base,
            },
            errorText: {
                color: "#ef4444",
                fontSize: Typography.fontSize.sm,
                fontWeight: Typography.fontWeight.medium,
            },
        }),

        DashboardStyles: StyleSheet.create({
            // Seção de perfil
            profileSection: {
                paddingVertical: Spacing[4],
                paddingHorizontal: Spacing[3],
                backgroundColor: colors.surfaceElevated,
                marginBottom: Spacing[4],
                borderBottomWidth: 1,
                borderBottomColor: colors.divider,
            },
            welcomeText: {
                fontSize: Typography.fontSize["2xl"],
                fontWeight: Typography.fontWeight.bold,
                color: colors.textPrimary,
                marginBottom: Spacing[3],
            },
            profileCard: {
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.lg,
                paddingVertical: Spacing[4],
                paddingHorizontal: Spacing[4],
                marginBottom: Spacing[3],
                borderWidth: 1,
                borderColor: colors.border,
                ...Shadows.sm,
            },
            // Linha de perfil
            profileRow: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: Spacing[3],
            },
            profileColumn: {
                alignItems: "center",
                flex: 1,
            },
            profileLabel: {
                fontSize: Typography.fontSize.xs,
                color: colors.textSecondary,
                fontWeight: Typography.fontWeight.medium,
                marginBottom: Spacing[1],
                textTransform: "uppercase",
                letterSpacing: 0.5,
            },
            profileValue: {
                fontSize: Typography.fontSize["3xl"],
                fontWeight: Typography.fontWeight.extrabold,
                color: colors.textPrimary,
            },
            profileCoins: {
                color: "#FFD700",
            },
            // Barra de XP
            xpContainer: {
                marginTop: Spacing[3],
                paddingTop: Spacing[3],
                borderTopWidth: 1,
                borderTopColor: colors.divider,
            },
            xpLabel: {
                fontSize: Typography.fontSize.sm,
                color: colors.textSecondary,
                fontWeight: Typography.fontWeight.medium,
                marginBottom: Spacing[2],
            },
            xpBar: {
                height: 10,
                backgroundColor: colors.neutral[200],
                borderRadius: BorderRadius.full,
                overflow: "hidden",
                marginBottom: Spacing[2],
                ...Shadows.xs,
            },
            xpFill: {
                height: "100%",
                backgroundColor: colors.success[500],
                borderRadius: BorderRadius.full,
            },
            xpText: {
                fontSize: Typography.fontSize.xs,
                color: colors.textTertiary,
                fontWeight: Typography.fontWeight.medium,
            },
            // Streak
            streakCard: {
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[4],
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.lg,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
                ...Shadows.sm,
            },
            streakIcon: {
                marginRight: Spacing[3],
                fontSize: 24,
            },
            streakContent: {
                flex: 1,
            },
            streakLabel: {
                fontSize: Typography.fontSize.sm,
                color: colors.textSecondary,
                fontWeight: Typography.fontWeight.medium,
            },
            streakValue: {
                fontSize: Typography.fontSize.xl,
                fontWeight: Typography.fontWeight.bold,
                color: colors.textPrimary,
            },
            // Seção de stats
            sectionTitle: {
                fontSize: Typography.fontSize.lg,
                fontWeight: Typography.fontWeight.bold,
                color: colors.textPrimary,
                marginBottom: Spacing[3],
                marginHorizontal: Spacing[4],
                marginTop: Spacing[4],
            },
            statsRow: {
                flexDirection: "row",
                justifyContent: "space-between",
                gap: Spacing[3],
                paddingHorizontal: Spacing[4],
                marginBottom: Spacing[4],
            },
            statCard: {
                flex: 1,
                paddingVertical: Spacing[4],
                paddingHorizontal: Spacing[3],
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.lg,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
                ...Shadows.sm,
            },
            statLabel: {
                fontSize: Typography.fontSize.xs,
                color: colors.textSecondary,
                marginBottom: Spacing[1],
                textTransform: "uppercase",
                fontWeight: Typography.fontWeight.semibold,
                letterSpacing: 0.5,
            },
            statValue: {
                fontSize: Typography.fontSize["2xl"],
                fontWeight: Typography.fontWeight.extrabold,
                color: colors.textPrimary,
            },
            // Badges/Conquistas
            badgesSection: {
                paddingVertical: Spacing[4],
                paddingHorizontal: Spacing[4],
            },
            badgesContainer: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: Spacing[3],
            },
            badgeItem: {
                width: "31%",
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[2],
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.lg,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
                ...Shadows.xs,
            },
            badgeIcon: {
                fontSize: 32,
                marginBottom: Spacing[2],
            },
            badgeTitle: {
                fontSize: Typography.fontSize.xs,
                fontWeight: Typography.fontWeight.bold,
                textAlign: "center",
                color: colors.textPrimary,
            },
            badgeDescription: {
                fontSize: Typography.fontSize.xs,
                color: colors.textTertiary,
                textAlign: "center",
                marginTop: Spacing[1],
            },
            // Tarefas recentes
            recentSection: {
                paddingVertical: Spacing[4],
                paddingHorizontal: Spacing[4],
            },
            recentItem: {
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[3],
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.lg,
                marginBottom: Spacing[2],
                borderLeftWidth: 4,
                borderLeftColor: colors.success[500],
                borderWidth: 1,
                borderColor: colors.border,
                ...Shadows.xs,
            },
            recentItemTitle: {
                fontSize: Typography.fontSize.base,
                fontWeight: Typography.fontWeight.semibold,
                marginBottom: Spacing[1],
                color: colors.textPrimary,
            },
            recentItemDate: {
                fontSize: Typography.fontSize.xs,
                color: colors.textSecondary,
            },
            recentItemPoints: {
                fontSize: Typography.fontSize.sm,
                color: colors.primary[600],
                fontWeight: Typography.fontWeight.semibold,
                marginTop: Spacing[1],
            },
        }),
    };
};
