import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";

interface PasswordScreenProps {
    onContinue: (password: string) => void;
}

export function PasswordScreen({ onContinue }: PasswordScreenProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { colors } = useTheme();

    const handleContinue = () => {
        onContinue(password);
    };

    const isValidPassword = (password: string) => {
        return password.length >= 8 && password === confirmPassword;
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText style={styles.header}>Account Information</ThemedText>
                <ThemedText style={styles.subtext}>Pick a password</ThemedText>

                <TextInput
                    style={[styles.input, { borderColor: colors.border }]}
                    placeholder="Enter Password"
                    placeholderTextColor={colors.text}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TextInput
                    style={[styles.input, { borderColor: colors.border }]}
                    placeholder="Confirm Password"
                    placeholderTextColor={colors.text}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <ThemedText style={styles.requirements}>Password must be at least 8 characters long</ThemedText>

                <Button
                    title="Continue"
                    onPress={handleContinue}
                    containerStyle={styles.button}
                    textStyle={styles.buttonText}
                    disabled={!isValidPassword(password)}
                />
            </View>
            <OnboardingProgress currentStep={3} totalSteps={6} />
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
        lineHeight: 32,
        fontWeight: "bold",
        textAlign: "left",
    },
    subtext: {
        fontSize: 16,
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
    requirements: {
        fontSize: 12,
        opacity: 0.7,
        textAlign: "left",
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
