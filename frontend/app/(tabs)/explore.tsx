import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import React, { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import AsyncStorageNative from "@react-native-async-storage/async-storage/src/AsyncStorage.native";

export default function ExploreScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { updateEmail, updateUserId, updateAccessToken } = useAuth();

    const handleLogin = async () => {
        try {
            console.log("Attempting login with:", email, password);

            const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email: email, password: password }),
            });

            const data = await response.json();
            console.log("Response data:", data);

            Alert.alert("Success", "Logged in successfully!");

            updateEmail(email);
            updateUserId(data.user);
            updateAccessToken(data.access_token);

            await AsyncStorageNative.setItem("refresh_token", data.refresh_token);
        } catch (error: any) {
            console.error("Login error:", error);
            Alert.alert("Error", error.message || "Couldn't connect to the server");
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flex: 1, marginBottom: 84, paddingTop: 64 }}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}>
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText}>PlateMate</Text>
                            <Text style={styles.subHeaderText}>Sign in to continue</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="your@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                />
                            </View>

                            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => {}}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => {}}>
                                <Text style={styles.signUpText}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    headerContainer: {
        marginBottom: 40,
    },
    headerText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    subHeaderText: {
        fontSize: 16,
        color: "#666",
    },
    formContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#555",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: "#fafafa",
    },
    forgotPasswordContainer: {
        alignSelf: "flex-end",
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: "#4a6ee0",
        fontSize: 14,
        fontWeight: "500",
    },
    loginButton: {
        backgroundColor: "#4a6ee0",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    footerText: {
        color: "#666",
        fontSize: 14,
    },
    signUpText: {
        color: "#4a6ee0",
        fontWeight: "600",
        fontSize: 14,
    },
});
