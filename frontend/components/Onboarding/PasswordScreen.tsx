import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";
import { sharedOnboardingStyles } from "./onboardingStyles";

// What do password requirements look like here

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
        <ThemedView style={[sharedOnboardingStyles.container]}>
            <View style={sharedOnboardingStyles.content}>
                <View style={sharedOnboardingStyles.headerContainer}>
                    <ThemedText style={sharedOnboardingStyles.header}>Account Information</ThemedText>
                    <ThemedText style={sharedOnboardingStyles.subtext}>Pick a password</ThemedText>
                </View>

                <TextInput
                    style={[sharedOnboardingStyles.input, { borderColor: colors.border }]}
                    placeholder="Enter Password"
                    placeholderTextColor={colors.text}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TextInput
                    style={[sharedOnboardingStyles.input, { borderColor: colors.border }]}
                    placeholder="Confirm Password"
                    placeholderTextColor={colors.text}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <ThemedText style={styles.requirements}>Password must be at least 8 characters long</ThemedText>
            </View>
            <Button
                title="Continue"
                onPress={handleContinue}
                containerStyle={sharedOnboardingStyles.button}
                textStyle={sharedOnboardingStyles.buttonText}
                disabled={!isValidPassword(password)}
            />
            <OnboardingProgress currentStep={3} totalSteps={6} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    requirements: {
        fontSize: 12,
        opacity: 0.7,
        textAlign: "left",
        marginTop: 8,
    },
});
