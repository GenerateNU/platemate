import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";
import { sharedOnboardingStyles } from "./onboardingStyles";
import { ChevronLeft } from "@/components/icons/Icons";

interface PasswordScreenProps {
    onContinue: (password: string) => void;
    onBack: () => void;
}

interface PasswordRequirements {
    hasMinLength: boolean;
    hasCapital: boolean;
    hasSymbol: boolean;
    hasNumber: boolean;
}

export function PasswordScreen({ onContinue, onBack }: PasswordScreenProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { colors } = useTheme();

    const handleContinue = () => {
        onContinue(password);
    };

    const checkPasswordRequirements = (password: string): PasswordRequirements => {
        return {
            hasMinLength: password.length >= 8,
            hasCapital: /[A-Z]/.test(password),
            hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasNumber: /[0-9]/.test(password),
        };
    };

    const isValidPassword = (password: string) => {
        const requirements = checkPasswordRequirements(password);
        return Object.values(requirements).every(Boolean) && password === confirmPassword;
    };

    const requirements = checkPasswordRequirements(password);
    const allRequirementsMet = Object.values(requirements).every(Boolean);

    return (
        <ThemedView style={[sharedOnboardingStyles.container]}>
            <TouchableOpacity style={sharedOnboardingStyles.backButton} onPress={onBack}>
                <ChevronLeft width={24} height={24} />
            </TouchableOpacity>
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

                {!allRequirementsMet && (password === confirmPassword || confirmPassword === "") && (
                    <View style={styles.requirementsContainer}>
                        <ThemedText style={styles.requirements}>Password strength too weak:</ThemedText>
                        <ThemedText
                            style={[styles.requirementListItem, requirements.hasMinLength && styles.requirementMet]}>
                            • At least 8 characters long
                        </ThemedText>
                        <ThemedText
                            style={[styles.requirementListItem, requirements.hasCapital && styles.requirementMet]}>
                            • One capital letter
                        </ThemedText>
                        <ThemedText
                            style={[styles.requirementListItem, requirements.hasSymbol && styles.requirementMet]}>
                            • One symbol
                        </ThemedText>
                        <ThemedText
                            style={[styles.requirementListItem, requirements.hasNumber && styles.requirementMet]}>
                            • One number
                        </ThemedText>
                    </View>
                )}

                {password !== confirmPassword && confirmPassword !== "" && (
                    <View style={styles.passwordMatchContainer}>
                        <ThemedText style={styles.warningText}>Passwords do not match</ThemedText>
                    </View>
                )}
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
        marginBottom: 4,
    },
    requirementsContainer: {
        marginTop: 8,
        marginBottom: -108,
    },
    requirementListItem: {
        fontSize: 12,
        opacity: 0.7,
        textAlign: "left",
    },
    requirementMet: {
        opacity: 0.5,
        textDecorationLine: "line-through",
    },
    warningText: {
        color: "#D32246",
        fontSize: 13,
    },
    linkContainer: {
        paddingBottom: 180,
        marginTop: -180,
        alignItems: "flex-start",
        paddingLeft: 8,
    },
    passwordMatchContainer: {
        alignItems: "flex-start",
        paddingLeft: 8,
    },
});
