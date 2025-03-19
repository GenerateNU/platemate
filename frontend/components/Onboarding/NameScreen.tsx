import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";

interface NameScreenProps {
    onContinue: (name: string) => void;
    onNavigateToLogin: () => void;
}

export function NameScreen({ onContinue, onNavigateToLogin }: NameScreenProps) {
    const [name, setName] = useState("");
    const { colors } = useTheme();

    const handleContinue = () => {
        onContinue(name);
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText style={styles.header}>Let's get started</ThemedText>
                <ThemedText style={styles.subtext}>What is your name?</ThemedText>

                <TextInput
                    style={[styles.input, { borderColor: colors.border }]}
                    placeholder="Enter Name"
                    placeholderTextColor={colors.text}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />

                <Button
                    title="Continue"
                    onPress={handleContinue}
                    containerStyle={styles.button}
                    textStyle={styles.buttonText}
                    disabled={!name.trim()}
                />

                <View style={styles.linkContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <ThemedText style={styles.linkText}>Already have an account? </ThemedText>
                        <TouchableOpacity onPress={onNavigateToLogin}>
                            <ThemedText style={{ color: "#FFCF0F", textDecorationLine: "underline" }}>
                                Sign in
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
                <OnboardingProgress currentStep={1} totalSteps={6} />
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
    linkContainer: {
        alignItems: "center",
        marginTop: 16,
    },
    linkText: {
        fontSize: 14,
    },
});
