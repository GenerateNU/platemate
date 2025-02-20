import React from "react";
import { Text, StyleSheet, ViewStyle } from "react-native";
import { ThemedTouchable } from "./ThemedTouchable";

interface EmojiTagProps {
    emoji: string;
    text: string;
    selected?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
}

export function EmojiTag({ emoji, text, selected = false, onPress, style }: EmojiTagProps) {
    return (
        <ThemedTouchable
            onPress={onPress}
            style={[selected ? styles.selected : styles.unselected, style]}
            activeOpacity={0.7}>
            <Text style={styles.tagText}>
                {emoji} {text}
            </Text>
        </ThemedTouchable>
    );
}

const styles = StyleSheet.create({
    selected: {
        backgroundColor: "#EFFCE1",
        borderColor: "#285852",
    },
    unselected: {
        backgroundColor: "transparent",
        borderColor: "#000000",
    },
    tagText: {
        fontSize: 16,
    },
});
