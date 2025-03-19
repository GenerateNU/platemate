import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";

// TODO: Will this open up to recommended page?
// How will the app know location - will it automate location request to see things near the new user

interface CompletionScreenProps {
    onComplete: () => void;
}

export function CompletionScreen({ onComplete }: CompletionScreenProps) {
    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText style={styles.header}>All Set!</ThemedText>
                <ThemedText style={styles.subtext}>Explore PlateMate</ThemedText>

                <Button
                    title="Let's Go"
                    onPress={onComplete}
                    containerStyle={styles.button}
                    textStyle={styles.buttonText}
                />
                <OnboardingProgress currentStep={6} totalSteps={6} />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        gap: 16,
    },
    header: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: "bold",
        textAlign: "left",
    },
    subtext: {
        fontSize: 18,
        marginTop: -5,
        textAlign: "left",
        opacity: 0.7,
        marginBottom: 32,
    },
    button: {
        height: 56,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 48,
        backgroundColor: "#FFCF0F",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
});
