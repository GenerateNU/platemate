import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";

interface ProgressBarProps {
    progress: 25 | 50 | 75 | 100;
}

export function ProgressBar({ progress }: ProgressBarProps) {
    const barWidth = 317;
    const progressWidth = (progress / 100) * barWidth;

    return (
        <ThemedView style={styles.bar}>
            <View style={[styles.progress, { width: progressWidth }]} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    bar: {
        backgroundColor: "#D9D9D9",
        width: 317,
        height: 10,
        borderRadius: 20,
        overflow: "hidden",
        gap: "10px",
    },
    progress: {
        backgroundColor: "#FFCF0F",
        height: 10,
    },
});
