// Componente de modal de nível

// Terceiros
import { useSettings } from "../context/SettingsContext";
import { createStyles } from "../styles/ScreenStyles";

// Elementos
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
    level: number;
    rewardCoins?: number;
};

export default function LevelUpModal({
    visible,
    onClose,
    level,
    rewardCoins,
}: Props) {
    const { theme } = useSettings();
    const { GamificationStyles } = createStyles(theme);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={GamificationStyles.levelModalOverlay}>
                <View style={GamificationStyles.levelModalCard}>
                    <Text style={GamificationStyles.levelModalTitle}>
                        Parabéns!
                    </Text>
                    
                    <Text
                        style={GamificationStyles.levelModalSubtitle}
                    >{`Você subiu para o nível ${level}.`}</Text>

                    {typeof rewardCoins === "number" ? (
                        <Text
                            style={GamificationStyles.levelRewardText}
                        >{`Recebeu ${rewardCoins} moedas.`}</Text>
                    ) : null}

                    <TouchableOpacity
                        style={GamificationStyles.levelModalBtn}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={GamificationStyles.levelModalBtnText}>
                            Fechar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
