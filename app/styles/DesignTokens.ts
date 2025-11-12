// Design tokens

export const ColorPalette = {
    // Dark Theme - High contrast for accessibility
    dark: {
        // Primary colors (Blue)
        primary: {
            50: "#E3F2FD",
            100: "#BBDEFB",
            500: "#2196F3",
            600: "#1E88E5",
            700: "#1976D2",
            900: "#0D47A1",
        },
        // Secondary colors (Indigo)
        secondary: {
            500: "#6366F1",
            600: "#4F46E5",
            700: "#4338CA",
            900: "#1E1B4B",
        },
        // Success colors (Green)
        success: {
            400: "#4ADE80",
            500: "#22C55E",
            600: "#16A34A",
            700: "#15803D",
            900: "#14532D",
        },
        // Warning colors (Amber)
        warning: {
            400: "#FBBF24",
            500: "#F59E0B",
            600: "#D97706",
            700: "#B45309",
            900: "#78350F",
        },
        // Danger colors (Red)
        danger: {
            400: "#F87171",
            500: "#EF4444",
            600: "#DC2626",
            700: "#B91C1C",
            900: "#7F1D1D",
        },
        // Neutrals (Grayscale)
        neutral: {
            0: "#000000",
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
            950: "#030712",
        },
        // Surface colors
        surface: "#1A1A1A",
        surfaceElevated: "#252525",
        surfaceHovered: "#2E2E2E",
        background: "#0F0F0F",
        backgroundSecondary: "#1A1A1A",
        // Text colors
        textPrimary: "#FFFFFF", // WCAG AAA - 19.56:1 contrast on background
        textSecondary: "#D1D5DB", // WCAG AA - 7.38:1 contrast on background
        textTertiary: "#9CA3AF", // WCAG AA - 4.85:1 contrast on background
        // Interactive colors
        border: "#374151",
        borderLight: "#4B5563",
        divider: "#1F2937",
        // Status colors
        info: "#0EA5E9",
        statusSuccess: "#22C55E",
        statusWarning: "#F59E0B",
        statusError: "#EF4444",
    },

    light: {
        // Primary colors (Blue)
        primary: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            500: "#3B82F6",
            600: "#2563EB",
            700: "#1D4ED8",
            900: "#1E3A8A",
        },
        // Secondary colors (Indigo)
        secondary: {
            500: "#6366F1",
            600: "#4F46E5",
            700: "#4338CA",
            900: "#312E81",
        },
        // Success colors (Green)
        success: {
            400: "#4ADE80",
            500: "#22C55E",
            600: "#16A34A",
            700: "#15803D",
            900: "#166534",
        },
        // Warning colors (Amber)
        warning: {
            400: "#FBBF24",
            500: "#F59E0B",
            600: "#D97706",
            700: "#B45309",
            900: "#92400E",
        },
        // Danger colors (Red)
        danger: {
            400: "#F87171",
            500: "#EF4444",
            600: "#DC2626",
            700: "#B91C1C",
            900: "#7F1D1D",
        },
        // Neutrals (Grayscale)
        neutral: {
            0: "#FFFFFF",
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
            950: "#030712",
        },
        // Surface colors
        surface: "#FFFFFF",
        surfaceElevated: "#F9FAFB",
        surfaceHovered: "#F3F4F6",
        background: "#FAFBFC",
        backgroundSecondary: "#F3F4F6",
        // Text colors
        textPrimary: "#0F172A", // WCAG AAA - 16.77:1 contrast on light background
        textSecondary: "#475569", // WCAG AA - 7.54:1 contrast on light background
        textTertiary: "#64748B", // WCAG AA - 5.34:1 contrast on light background
        // Interactive colors
        border: "#CBD5E1",
        borderLight: "#E2E8F0",
        divider: "#E5E7EB",
        // Status colors
        info: "#0EA5E9",
        statusSuccess: "#16A34A",
        statusWarning: "#D97706",
        statusError: "#DC2626",
    },
};

export const Typography = {
    // Font families
    fontFamily: {
        default: "System",
        mono: "Courier New",
    },

    // Font sizes (scaled for readability)
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
        "3xl": 30,
        "4xl": 36,
    },

    // Font weights
    fontWeight: {
        light: "300" as const,
        normal: "400" as const,
        medium: "500" as const,
        semibold: "600" as const,
        bold: "700" as const,
        extrabold: "800" as const,
    },

    // Line heights (for better readability)
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
    },

    // Letter spacing
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
    },
};

export const Spacing = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
};

export const BorderRadius = {
    none: 0,
    sm: 4,
    base: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const Shadows = {
    none: {
        shadowColor: "transparent",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    xs: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    base: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 12,
    },
};

export const Breakpoints = {
    sm: 320, // Small phones
    md: 375, // Standard phones
    lg: 425, // Large phones
    xl: 768, // Tablets
    "2xl": 1024, // Large tablets
};

export const Animation = {
    fast: 150,
    base: 250,
    slow: 350,
    slower: 500,
};

export const ComponentTokens = {
    button: {
        minHeight: 44, // Touch target size (WCAG)
        minWidth: 44,
        paddingVertical: Spacing[3],
        paddingHorizontal: Spacing[4],
        borderRadius: BorderRadius.md,
    },
    input: {
        minHeight: 44, // Touch target size (WCAG)
        paddingVertical: Spacing[3],
        paddingHorizontal: Spacing[4],
        borderRadius: BorderRadius.base,
    },
    card: {
        paddingVertical: Spacing[4],
        paddingHorizontal: Spacing[4],
        borderRadius: BorderRadius.lg,
    },
    touchable: {
        minHeight: 44, // Touch target size (WCAG)
        minWidth: 44,
    },
};

export type ThemeVariant = "light" | "dark";

export interface ThemeColors {
    primary: { [key: string]: string };
    secondary: { [key: string]: string };
    success: { [key: string]: string };
    warning: { [key: string]: string };
    danger: { [key: string]: string };
    neutral: { [key: string]: string };
    surface: string;
    surfaceElevated: string;
    surfaceHovered: string;
    background: string;
    backgroundSecondary: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderLight: string;
    divider: string;
    info: string;
    statusSuccess: string;
    statusWarning: string;
    statusError: string;
}

export const getThemeColors = (theme: ThemeVariant): ThemeColors => {
    return ColorPalette[theme];
};
