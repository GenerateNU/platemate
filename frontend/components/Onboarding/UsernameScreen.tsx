import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";
import { sharedOnboardingStyles } from "./onboardingStyles";

interface UsernameScreenProps {
    onContinue: (username: string) => void;
}

export function UsernameScreen({ onContinue }: UsernameScreenProps) {
    const [username, setUsername] = useState("");
    const { colors } = useTheme();

    const handleContinue = () => {
        onContinue(username);
    };

    const isValidUsername = (username: string) => {
        return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
    };

    return (
        <ThemedView style={[sharedOnboardingStyles.container]}>
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

                {/* TODO: This should only come up once we have checked auth etc... */}
                <ThemedText style={styles.inUseText}>This username is already in use</ThemedText>
            </View>

            <Button
                title="Continue"
                onPress={handleContinue}
                containerStyle={sharedOnboardingStyles.button}
                textStyle={sharedOnboardingStyles.buttonText}
                disabled={!isValidUsername(username)}
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
    inUseText: {
        paddingBottom: 180,
        marginTop: -180,
        alignItems: "flex-start",
        paddingLeft: 8,
    },
});
