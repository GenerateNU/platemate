import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { sharedOnboardingStyles } from "./onboardingStyles";

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
                <View style={styles.logoContainer}>
                    <Image source={require("@/assets/brand/wordmark.png")} style={styles.logo} resizeMode="contain" />
                </View>

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
    logoContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 264,
        height: 130,
    },
});
