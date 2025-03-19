import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";

interface EmailScreenProps {
    onContinue: (email: string) => void;
}

export function EmailScreen({ onContinue }: EmailScreenProps) {
    const [email, setEmail] = useState("");
    const { colors } = useTheme();

    const handleContinue = () => {
        onContinue(email);
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText style={styles.header}>Account Information</ThemedText>
                <ThemedText style={styles.subtext}>What is your email?</ThemedText>

                <TextInput
                    style={[styles.input, { borderColor: colors.border }]}
                    placeholder="Enter Email"
                    placeholderTextColor={colors.text}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                />

                <Button
                    title="Continue"
                    onPress={handleContinue}
                    containerStyle={styles.button}
                    textStyle={styles.buttonText}
                    disabled={!isValidEmail(email)}
                />
            </View>
            <OnboardingProgress currentStep={2} totalSteps={6} />
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
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "left",
    },
    subtext: {
        fontSize: 16,
        marginTop: -5,
        textAlign: "left",
        opacity: 0.7,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        marginTop: 8,
    },
    button: {
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFCF0F",
        marginTop: 24,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
