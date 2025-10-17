// Componente de barra de XP

// Terceiros
import { useUserProfile } from "../hooks/useUserProfile";
import { requiredXpForLevel } from "../services/UserProfileStorage";

// Elementos
import { Text, TouchableOpacity, View } from "react-native";
import { useSettings } from "../context/SettingsContext";
import { createStyles } from "../styles/ScreenStyles";

export default function XPBar() {
    const { profile } = useUserProfile();
    const { theme } = useSettings();
    const { GamificationStyles } = createStyles(theme);

    if (!profile) return null;

    const current = profile.xp;
    const need = requiredXpForLevel(profile.level + 1);
    const pct = Math.min(100, Math.round((current / need) * 100));

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={GamificationStyles.xpContainer}
        >
            <View style={GamificationStyles.xpRow}>
                <Text
                    style={GamificationStyles.xpLevelText}
                >{`Nível ${profile.level}`}</Text>

                <Text
                    style={GamificationStyles.xpText}
                >{`${current}/${need} XP`}</Text>
            </View>

            <View style={GamificationStyles.xpBarWrap}>
                <View
                    style={[GamificationStyles.xpBarFill, { width: `${pct}%` }]}
                />
            </View>
        </TouchableOpacity>
    );
}
