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
import { login, register } from "@/api/auth";
import { makeRequest } from "@/api/base";
import { router } from "expo-router";

export default function ExploreScreen() {
    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { updateEmail, updateUserId, updateAccessToken } = useAuth();

    const handleLogin = async () => {
        try {
            const data = await login({ email, password });
            console.log("Response data:", data);

            Alert.alert("Yay! 🎉", "Welcome back to PlateMate!");

            updateEmail(email);
            updateUserId(data.user);
            updateAccessToken(data.access_token);

            await AsyncStorageNative.setItem("refresh_token", data.refresh_token);
        } catch (error: any) {
            console.error("Login error:", error);
            Alert.alert("Oops! 😕", error.message || "Couldn't connect to the server");
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}>
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText}>PlateMate</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>First Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="Danny"
                                    keyboardType="default"
                                    autoCapitalize="words"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Last Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={surname}
                                    onChangeText={setSurname}
                                    placeholder="Rollo"
                                    keyboardType="default"
                                    autoCapitalize="words"
                                />
                            </View>

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
                                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>Log In</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                                <Text style={styles.signUpText}>Log in!</Text>
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
        backgroundColor: "#f8f8f8",
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        alignContent: "center",
        padding: 24,
    },
    headerContainer: {
        marginBottom: 20,
        alignItems: "center",
    },
    headerText: {
        fontSize: 42,
        color: "#333",
        fontStyle: "italic",
        fontFamily: "Damion-Regular",
    },
    subHeaderText: {
        fontSize: 18,
        color: "#666",
    },
    formContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: "#DAA520",
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        fontFamily: "Outfit",
        color: "#555",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
        color: "#333",
        fontFamily: "Outfit",
    },
    forgotPasswordContainer: {
        alignSelf: "flex-end",
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: "#DAA520",
        fontSize: 14,
        fontWeight: "500",
        fontFamily: "Outfit",
    },
    loginButton: {
        backgroundColor: "#DAA520",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        fontFamily: "Outfit",
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
    },
    footerText: {
        color: "#666",
        fontSize: 16,
        fontFamily: "Outfit",
    },
    signUpText: {
        color: "#DAA520",
        fontWeight: "600",
        fontSize: 16,
        fontFamily: "Outfit",
    },
});
