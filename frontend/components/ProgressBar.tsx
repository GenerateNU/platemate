import React, { useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { ThemedView } from "@/components/ThemedView";

interface ProgressBarProps {
    progress: 25 | 50 | 75 | 100;
}

export function ProgressBar({ progress }: ProgressBarProps) {
    const [containerWidth, setContainerWidth] = useState(0);

    const onLayout = (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    const progressWidth = containerWidth * (progress / 100);

    return (
        <ThemedView style={styles.bar} onLayout={onLayout}>
            <View style={[styles.progress, { width: progressWidth }]} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    bar: {
        backgroundColor: "#D9D9D9",
        width: "100%",
        height: 10,
        borderRadius: 20,
        overflow: "hidden",
    },
    progress: {
        backgroundColor: "#FFCF0F",
        height: 10,
    },
});
