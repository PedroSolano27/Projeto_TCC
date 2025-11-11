import React from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getAllTags } from "../config/tags";
import { createStyles } from "../styles/ScreenStyles";

type Props = {
    selectedTag: string;
    onSelectTag: (tagId: string) => void;
    theme: "light" | "dark";
};

export function TagSelector({ selectedTag, onSelectTag, theme }: Props) {
    const { TagSelectorStyles } = createStyles(theme);
    const [showModal, setShowModal] = React.useState(false);
    const tags = getAllTags();
    const selected = tags.find((t) => t.id === selectedTag);

    return (
        <>
            <View style={TagSelectorStyles.container}>
                <Text style={TagSelectorStyles.label}>Categoria da Tarefa</Text>
                <TouchableOpacity
                    style={TagSelectorStyles.trigger}
                    onPress={() => setShowModal(true)}
                >
                    <Text style={TagSelectorStyles.triggerText}>
                        {selected?.label || "Selecionar categoria"}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showModal} transparent animationType="fade">
                <Pressable
                    style={TagSelectorStyles.overlay}
                    onPress={() => setShowModal(false)}
                >
                    <View style={TagSelectorStyles.modal}>
                        <Text style={TagSelectorStyles.modalTitle}>
                            Selecione a Categoria
                        </Text>
                        <ScrollView style={TagSelectorStyles.optionsList}>
                            {tags.map((tag) => (
                                <TouchableOpacity
                                    key={tag.id}
                                    style={[
                                        TagSelectorStyles.option,
                                        selectedTag === tag.id &&
                                            TagSelectorStyles.optionSelected,
                                    ]}
                                    onPress={() => {
                                        onSelectTag(tag.id);
                                        setShowModal(false);
                                    }}
                                >
                                    <View>
                                        <Text
                                            style={
                                                TagSelectorStyles.optionLabel
                                            }
                                        >
                                            {tag.label}
                                        </Text>
                                        <Text
                                            style={
                                                TagSelectorStyles.optionDescription
                                            }
                                        >
                                            {tag.description}
                                        </Text>
                                        <Text
                                            style={
                                                TagSelectorStyles.optionRewards
                                            }
                                        >
                                            {tag.basePoints} pontos •{" "}
                                            {tag.baseXP} XP
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}
