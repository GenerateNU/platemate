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

interface UsernameScreenProps {
    onContinue: (username: string) => void;
    onNavigateToLogin: () => void;
    onBack: () => void;
}

export function UsernameScreen({ onContinue, onNavigateToLogin, onBack }: UsernameScreenProps) {
    const [username, setUsername] = useState("");
    const [usernameExists, setUsernameExists] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const { colors } = useTheme();
    const { checkUsernameExists } = useAuthStore();

    // Debounce username check to avoid too many requests
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (username && isValidUsername(username)) {
                setIsChecking(true);
                const exists = await checkUsernameExists(username);
                setUsernameExists(exists);
                setIsChecking(false);
            } else {
                setUsernameExists(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    const handleContinue = () => {
        onContinue(username);
    };

    const isValidUsername = (username: string) => {
        return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
    };

    return (
        <ThemedView style={[sharedOnboardingStyles.container]}>
            <TouchableOpacity style={sharedOnboardingStyles.backButton} onPress={onBack}>
                <ChevronLeft width={24} height={24} />
            </TouchableOpacity>
            <View style={sharedOnboardingStyles.content}>
                <View style={sharedOnboardingStyles.headerContainer}>
                    <ThemedText style={sharedOnboardingStyles.header}>Account Information</ThemedText>
                    <ThemedText style={sharedOnboardingStyles.subtext}>Pick a username</ThemedText>
                </View>

                <TextInput
                    style={[sharedOnboardingStyles.input, { borderColor: colors.border }]}
                    placeholder="Enter Username"
                    placeholderTextColor={colors.text}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {/* Show username already in use message conditionally */}
            {username.trim() !== "" && usernameExists && (
                <View style={styles.linkContainer}>
                    <View style={sharedOnboardingStyles.linkContent}>
                        <ThemedText style={styles.warningText}>This username is already in use </ThemedText>
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
                disabled={!isValidUsername(username) || isChecking || usernameExists}
            />
            <OnboardingProgress currentStep={4} totalSteps={6} />
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
    warningText: {
        color: "#D32246",
        fontSize: 13,
    },
    warningLinkText: {
        color: "#D32246",
        fontSize: 13,
        textDecorationLine: "underline",
    },
    inUseText: {
        paddingBottom: 180,
        marginTop: -180,
        alignItems: "flex-start",
        paddingLeft: 8,
        color: "#D32246",
    },
    linkContainer: {
        paddingBottom: 180,
        marginTop: -180,
        alignItems: "flex-start",
        paddingLeft: 8,
    },
});
