import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

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
        <ThemedView style={styles.container}>
            <ThemedText style={styles.header}>Login to your account</ThemedText>

            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, { borderColor: colors.border }]}
                    placeholder="Email"
                    placeholderTextColor={colors.text}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={[styles.input, { borderColor: colors.border }]}
                    placeholder="Password"
                    placeholderTextColor={colors.text}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <Button
                title="Login"
                onPress={handleLogin}
                containerStyle={styles.button}
                textStyle={styles.buttonText}
                disabled={!email || !password}
            />

            <View style={styles.linkContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ThemedText style={styles.linkText}>Don't have an account? </ThemedText>
                    <TouchableOpacity onPress={onNavigateToOnboarding}>
                        <ThemedText style={{ color: "#FFCF0F", textDecorationLine: "underline" }}>
                            Create one
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    header: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: "bold",
        marginBottom: 32,
        textAlign: "left",
    },
    inputContainer: {
        gap: 16,
        marginBottom: 24,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    button: {
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        backgroundColor: "#FFCF0F",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    linkContainer: {
        alignItems: "center",
    },
    linkText: {
        fontSize: 14,
    },
});
