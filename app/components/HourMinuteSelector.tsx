/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { createStyles } from "../styles/ScreenStyles";

type Props = {
    onSelectTime: (timestamp: string) => void;
    theme: "light" | "dark";
    selectedDate?: string;
};

export function HourMinuteSelector({
    onSelectTime,
    theme,
    selectedDate,
}: Props) {
    const { HourMinuteSelectorStyles } = createStyles(theme);
    const [showModal, setShowModal] = React.useState(false);
    const [hours, setHours] = useState<string>("0");
    const [minutes, setMinutes] = useState<string>("0");
    const [error, setError] = useState<string>("");

    const handleHoursChange = (text: string) => {
        // Max 23
        const numValue = text === "" ? "0" : text;
        const parsed = Math.min(Math.max(0, parseInt(numValue) || 0), 23);
        setHours(parsed.toString());
    };

    const handleMinutesChange = (text: string) => {
        // Max 59
        const numValue = text === "" ? "0" : text;
        const parsed = Math.min(Math.max(0, parseInt(numValue) || 0), 59);
        setMinutes(parsed.toString());
    };

    const calculateScheduledTime = (): {
        timestamp: string;
        isInPast: boolean;
    } | null => {
        if (!selectedDate) return null;

        const baseDate = new Date(selectedDate);
        const h = parseInt(hours) || 0;
        const m = parseInt(minutes) || 0;

        // Set the hours and minutes on the selected date
        baseDate.setHours(h, m, 0, 0);

        const now = new Date();
        const isInPast = baseDate < now;

        return {
            timestamp: baseDate.toISOString(),
            isInPast,
        };
    };

    useEffect(() => {
        const result = calculateScheduledTime();
        if (result?.isInPast) {
            setError("O horário selecionado está no passado");
        } else {
            setError("");
        }
    }, [hours, minutes, selectedDate]);

    const handleConfirm = () => {
        const result = calculateScheduledTime();
        if (!result) {
            setError("Selecione uma data primeiro");
            return;
        }
        if (result.isInPast) {
            setError("Não é possível agendar no passado");
            return;
        }
        onSelectTime(result.timestamp);
        setShowModal(false);
        setHours("0");
        setMinutes("0");
        setError("");
    };

    const handleCancel = () => {
        setShowModal(false);
        setHours("0");
        setMinutes("0");
        setError("");
    };

    const formatDisplay = () => {
        const h = parseInt(hours) || 0;
        const m = parseInt(minutes) || 0;
        if (h === 0 && m === 0) return "Tempo customizado";
        return `${h}h ${m}m`;
    };

    const isConfirmDisabled = () => {
        const result = calculateScheduledTime();
        return !result || result.isInPast;
    };

    return (
        <>
            <TouchableOpacity
                style={HourMinuteSelectorStyles.trigger}
                onPress={() => setShowModal(true)}
                accessibilityLabel="Seletor de hora e minuto customizado"
                accessible={true}
            >
                <Text style={HourMinuteSelectorStyles.triggerText}>
                    {formatDisplay()}
                </Text>
            </TouchableOpacity>

            <Modal visible={showModal} transparent animationType="fade">
                <Pressable
                    style={HourMinuteSelectorStyles.overlay}
                    onPress={handleCancel}
                >
                    <View
                        style={HourMinuteSelectorStyles.modal}
                        onStartShouldSetResponder={() => true}
                    >
                        <Text style={HourMinuteSelectorStyles.modalTitle}>
                            Tempo Customizado
                        </Text>
                        <Text style={HourMinuteSelectorStyles.modalSubtitle}>
                            Digite horas e minutos para uma notificação
                            customizada
                        </Text>

                        <View style={HourMinuteSelectorStyles.inputContainer}>
                            <View style={HourMinuteSelectorStyles.inputGroup}>
                                <Text style={HourMinuteSelectorStyles.label}>
                                    Horas
                                </Text>
                                <TextInput
                                    style={HourMinuteSelectorStyles.input}
                                    value={hours}
                                    onChangeText={handleHoursChange}
                                    keyboardType="number-pad"
                                    placeholder="0"
                                    placeholderTextColor="#999"
                                    maxLength={2}
                                    accessibilityLabel="Horas"
                                    accessible={true}
                                    editable={!!selectedDate}
                                />
                                <Text style={HourMinuteSelectorStyles.unit}>
                                    (0-23)
                                </Text>
                            </View>

                            <View style={HourMinuteSelectorStyles.separator} />

                            <View style={HourMinuteSelectorStyles.inputGroup}>
                                <Text style={HourMinuteSelectorStyles.label}>
                                    Minutos
                                </Text>
                                <TextInput
                                    style={HourMinuteSelectorStyles.input}
                                    value={minutes}
                                    onChangeText={handleMinutesChange}
                                    keyboardType="number-pad"
                                    placeholder="0"
                                    placeholderTextColor="#999"
                                    maxLength={2}
                                    accessibilityLabel="Minutos"
                                    accessible={true}
                                    editable={!!selectedDate}
                                />
                                <Text style={HourMinuteSelectorStyles.unit}>
                                    (0-59)
                                </Text>
                            </View>
                        </View>

                        {!selectedDate && (
                            <Text
                                style={[
                                    HourMinuteSelectorStyles.errorText,
                                    { marginTop: 12 },
                                ]}
                            >
                                Selecione uma data primeiro
                            </Text>
                        )}

                        {error && (
                            <Text
                                style={[
                                    HourMinuteSelectorStyles.errorText,
                                    { marginTop: 12 },
                                ]}
                            >
                                {error}
                            </Text>
                        )}

                        <View style={HourMinuteSelectorStyles.buttonContainer}>
                            <TouchableOpacity
                                style={[
                                    HourMinuteSelectorStyles.button,
                                    HourMinuteSelectorStyles.cancelBtn,
                                ]}
                                onPress={handleCancel}
                                accessibilityLabel="Cancelar"
                                accessible={true}
                            >
                                <Text
                                    style={
                                        HourMinuteSelectorStyles.cancelBtnText
                                    }
                                >
                                    Cancelar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    HourMinuteSelectorStyles.button,
                                    HourMinuteSelectorStyles.confirmBtn,
                                    isConfirmDisabled() && { opacity: 0.5 },
                                ]}
                                onPress={handleConfirm}
                                disabled={isConfirmDisabled()}
                                accessibilityLabel="Confirmar"
                                accessible={true}
                            >
                                <Text
                                    style={
                                        HourMinuteSelectorStyles.confirmBtnText
                                    }
                                >
                                    Confirmar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}
