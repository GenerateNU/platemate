import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { sharedOnboardingStyles } from "./onboardingStyles";

// TODO: Add logo/branding

interface LoginScreenProps {
    onLogin: (email: string, password: string) => void;
    onNavigateToOnboarding: () => void;
}

export function LoginScreen({ onLogin, onNavigateToOnboarding }: LoginScreenProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { colors } = useTheme();

    const handleLogin = () => {
        onLogin(email, password);
    };

    return (
        <ThemedView style={[sharedOnboardingStyles.container]}>
            <View style={sharedOnboardingStyles.content}>
                <View style={sharedOnboardingStyles.headerContainer}>
                    <ThemedText style={sharedOnboardingStyles.header}>Login to your account</ThemedText>
                </View>

                <View style={sharedOnboardingStyles.inputContainer}>
                    <TextInput
                        style={[sharedOnboardingStyles.input, { borderColor: colors.border }]}
                        placeholder="Email"
                        placeholderTextColor={colors.text}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={[sharedOnboardingStyles.input, { borderColor: colors.border }]}
                        placeholder="Password"
                        placeholderTextColor={colors.text}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <Button
                    title="Log in"
                    onPress={handleLogin}
                    containerStyle={sharedOnboardingStyles.button}
                    textStyle={sharedOnboardingStyles.buttonText}
                    disabled={!email || !password}
                />
            </View>

            <View style={sharedOnboardingStyles.linkContainer}>
                <View style={sharedOnboardingStyles.linkContent}>
                    <ThemedText style={sharedOnboardingStyles.linkText}>Don't have an account? </ThemedText>
                    <TouchableOpacity onPress={onNavigateToOnboarding}>
                        <ThemedText style={styles.createAccountText}>Create one</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    createAccountText: {
        color: "#FFCF0F",
        textDecorationLine: "underline",
        fontSize: 13,
    },
});
