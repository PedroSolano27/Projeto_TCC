import React from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { createStyles } from "../styles/ScreenStyles";

const NOTIFICATION_TIMES = [
    { id: "1h", label: "1 hora", hours: 1 },
    { id: "2h", label: "2 horas", hours: 2 },
    { id: "4h", label: "4 horas", hours: 4 },
    { id: "8h", label: "8 horas", hours: 8 },
    { id: "12h", label: "12 horas", hours: 12 },
    { id: "24h", label: "1 dia", hours: 24 },
];

type Props = {
    selectedTimes: string[];
    onSelectTimes: (timeIds: string[]) => void;
    theme: "light" | "dark";
};

export function TimeSelector({ selectedTimes, onSelectTimes, theme }: Props) {
    const { TimeSelectorStyles } = createStyles(theme);
    const [showModal, setShowModal] = React.useState(false);

    const toggleTime = (timeId: string) => {
        const updated = selectedTimes.includes(timeId)
            ? selectedTimes.filter((t) => t !== timeId)
            : [...selectedTimes, timeId];
        onSelectTimes(updated);
    };

    const selectedLabels = NOTIFICATION_TIMES.filter((t) =>
        selectedTimes.includes(t.id),
    )
        .map((t) => t.label)
        .join(", ");

    return (
        <>
            <View style={TimeSelectorStyles.container}>
                <Text style={TimeSelectorStyles.label}>Notificações</Text>
                <TouchableOpacity
                    style={TimeSelectorStyles.trigger}
                    onPress={() => setShowModal(true)}
                >
                    <Text style={TimeSelectorStyles.triggerText}>
                        {selectedLabels || "Sem notificações"}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showModal} transparent animationType="fade">
                <Pressable
                    style={TimeSelectorStyles.overlay}
                    onPress={() => setShowModal(false)}
                >
                    <View style={TimeSelectorStyles.modal}>
                        <Text style={TimeSelectorStyles.modalTitle}>
                            Escolha Quando Ser Notificado
                        </Text>
                        <Text style={TimeSelectorStyles.modalSubtitle}>
                            Você pode selecionar múltiplos horários
                        </Text>
                        <ScrollView style={TimeSelectorStyles.optionsList}>
                            {NOTIFICATION_TIMES.map((time) => {
                                const isSelected = selectedTimes.includes(
                                    time.id,
                                );
                                return (
                                    <TouchableOpacity
                                        key={time.id}
                                        style={[
                                            TimeSelectorStyles.option,
                                            isSelected &&
                                                TimeSelectorStyles.optionSelected,
                                        ]}
                                        onPress={() => toggleTime(time.id)}
                                    >
                                        <View
                                            style={TimeSelectorStyles.checkbox}
                                        >
                                            {isSelected && (
                                                <Text
                                                    style={
                                                        TimeSelectorStyles.checkmark
                                                    }
                                                >
                                                    ✓
                                                </Text>
                                            )}
                                        </View>
                                        <Text
                                            style={
                                                TimeSelectorStyles.optionLabel
                                            }
                                        >
                                            {`${time.label} antes de expirar`}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        <TouchableOpacity
                            style={TimeSelectorStyles.closeBtn}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={TimeSelectorStyles.closeBtnText}>
                                Feito
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}
