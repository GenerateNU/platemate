import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";
import { sharedOnboardingStyles } from "./onboardingStyles";

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
        <ThemedView style={[sharedOnboardingStyles.container]}>
            <View style={sharedOnboardingStyles.content}>
                <View style={sharedOnboardingStyles.headerContainer}>
                    <ThemedText style={sharedOnboardingStyles.header}>Let's get started</ThemedText>
                    <ThemedText style={sharedOnboardingStyles.subtext}>What is your name?</ThemedText>
                </View>

                <TextInput
                    style={[sharedOnboardingStyles.input, { borderColor: colors.border }]}
                    placeholder="Enter Name"
                    placeholderTextColor={colors.text}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />
            </View>

            <View style={styles.linkContainer}>
                <View style={sharedOnboardingStyles.linkContent}>
                    <ThemedText style={sharedOnboardingStyles.linkText}>Already have an account? </ThemedText>
                    <TouchableOpacity onPress={onNavigateToLogin}>
                        <ThemedText style={styles.createAccountText}>Sign in</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>

            <Button
                title="Continue"
                onPress={handleContinue}
                containerStyle={sharedOnboardingStyles.button}
                textStyle={sharedOnboardingStyles.buttonText}
                disabled={!name.trim()}
            />
            <OnboardingProgress currentStep={1} totalSteps={6} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
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
