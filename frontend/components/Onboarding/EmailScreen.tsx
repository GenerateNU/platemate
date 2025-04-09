import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";
import { sharedOnboardingStyles } from "./onboardingStyles";
import { ChevronLeft } from "@/components/icons/Icons";
import useAuthStore from "@/auth/store";

interface EmailScreenProps {
    onContinue: (email: string) => void;
    onNavigateToLogin: () => void;
    onBack: () => void;
}

export function EmailScreen({ onContinue, onNavigateToLogin, onBack }: EmailScreenProps) {
    const [email, setEmail] = useState("");
    const [emailExists, setEmailExists] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const { colors } = useTheme();
    const { checkEmailExists } = useAuthStore();

    // Debounce email check to avoid too many requests
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (email && isValidEmail(email)) {
                setIsChecking(true);
                const exists = await checkEmailExists(email);
                setEmailExists(exists);
                setIsChecking(false);
            } else {
                setEmailExists(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [email]);

    const handleContinue = () => {
        onContinue(email);
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <ThemedView style={[sharedOnboardingStyles.container]}>
            <TouchableOpacity style={sharedOnboardingStyles.backButton} onPress={onBack}>
                <ChevronLeft width={24} height={24} />
            </TouchableOpacity>
            <View style={sharedOnboardingStyles.content}>
                <View style={sharedOnboardingStyles.headerContainer}>
                    <ThemedText style={sharedOnboardingStyles.header}>Account Information</ThemedText>
                    <ThemedText style={sharedOnboardingStyles.subtext}>What is your email?</ThemedText>
                </View>

                <TextInput
                    style={[sharedOnboardingStyles.input, { borderColor: colors.border }]}
                    placeholder="Enter Email"
                    placeholderTextColor={colors.text}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                />
            </View>

            {/* Show email already in use message conditionally */}
            {emailExists && (
                <View style={styles.linkContainer}>
                    <View style={sharedOnboardingStyles.linkContent}>
                        <ThemedText style={styles.warningText}>This email is already in use </ThemedText>
                        <TouchableOpacity onPress={onNavigateToLogin}>
                            <ThemedText style={styles.warningLinkText}>Sign in</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <Button
                title={isChecking ? "Checking..." : "Continue"}
                onPress={handleContinue}
                containerStyle={sharedOnboardingStyles.button}
                textStyle={sharedOnboardingStyles.buttonText}
                disabled={!isValidEmail(email) || isChecking || emailExists}
            />
            <OnboardingProgress currentStep={2} totalSteps={6} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    warningText: {
        color: "#D32246",
        fontSize: 13,
    },
    warningLinkText: {
        color: "#D32246",
        fontSize: 13,
        textDecorationLine: "underline",
    },
    createAccountText: {
        color: "#FFCF0F",
        textDecorationLine: "underline",
        fontSize: 13,
    },
    linkContainer: {
        paddingBottom: 180,
        marginTop: -180,
        alignItems: "flex-start",
        paddingLeft: 8,
    },
});
