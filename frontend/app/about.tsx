import { Button, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";

export default function AboutScreen() {
    return (
        <ThemedView style={styles.textContainer}>
            <ThemedText type="default" style={{ fontFamily: "Outfit" }}>
                This text serves as the body content of the example stack.
            </ThemedText>

            <Button
                title="Click Me"
                onPress={() => {
                    console.log("Button pressed!");
                }}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
        alignItems: "center",
        padding: 12,
    },
});
