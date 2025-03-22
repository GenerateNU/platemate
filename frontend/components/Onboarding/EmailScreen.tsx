import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";
import { sharedOnboardingStyles } from "./onboardingStyles";

// TODO: if email is already taken will it redirect to sign in screen?

interface EmailScreenProps {
    onContinue: (email: string) => void;
}

export function EmailScreen({ onContinue }: EmailScreenProps) {
    const [email, setEmail] = useState("");
    const { colors } = useTheme();

    const handleContinue = () => {
        onContinue(email);
    };

    // TODO: What does email already taken error look like here
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <ThemedView style={[sharedOnboardingStyles.container]}>
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

            <Button
                title="Continue"
                onPress={handleContinue}
                containerStyle={sharedOnboardingStyles.button}
                textStyle={sharedOnboardingStyles.buttonText}
                disabled={!isValidEmail(email)}
            />
            <OnboardingProgress currentStep={2} totalSteps={6} />
        </ThemedView>
    );
}
