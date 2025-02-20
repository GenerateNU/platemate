import React from "react";
import { Text, StyleSheet } from "react-native";
import { ThemedTouchable } from "./ThemedTouchable";

interface EmojiTagProps {
    emoji: string;
    text: string;
    selected?: boolean;
    onPress?: () => void;
}

// Use ThemedTouchable inside EmojiTag
export function EmojiTag({ emoji, text, selected = false, onPress }: EmojiTagProps) {
    return (
        <ThemedTouchable onPress={onPress} style={selected ? styles.selected : styles.unselected} activeOpacity={0.7}>
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
