import React from "react";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";

interface ThemedTagProps {
    title: string;
    backgroundColor: string;
    textColor: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function ThemedTag({ title, backgroundColor, textColor, style, textStyle }: ThemedTagProps) {
    return (
        <ThemedView style={[styles.tagContainer, { backgroundColor }, style]}>
            <ThemedText style={[styles.tagText, { color: textColor }, textStyle]}>{title}</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    tagContainer: {
        gap: 4,
        borderRadius: 50,
        marginRight: 8,
    },
    tagText: {
        fontSize: 14,
        paddingHorizontal: 12,
        paddingVertical: 4,
        fontWeight: "500",
        fontFamily: "Outfit",
    },
});
