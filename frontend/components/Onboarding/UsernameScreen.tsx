import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";

// TODO: What does username alr taken error look like here

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
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText style={styles.header}>Account Information</ThemedText>
                <ThemedText style={styles.subtext}>Pick a username</ThemedText>

                <TextInput
                    style={[styles.input, { borderColor: colors.border }]}
                    placeholder="Enter Username"
                    placeholderTextColor={colors.text}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <ThemedText style={styles.requirements}>
                    Username must be at least 3 characters long and can only contain letters, numbers, and underscores
                </ThemedText>

                <Button
                    title="Continue"
                    onPress={handleContinue}
                    containerStyle={styles.button}
                    textStyle={styles.buttonText}
                    disabled={!isValidUsername(username)}
                />
                <OnboardingProgress currentStep={4} totalSteps={6} />
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
        lineHeight: 32,
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
        marginTop: 24,
        backgroundColor: "#FFCF0F",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
