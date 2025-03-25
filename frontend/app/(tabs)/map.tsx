"use client";

import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import useAuthStore from "@/auth/store";

export default function MapScreen() {
    const { isAuthenticated, loading, login, logout, register, initializeAuth } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // Initialize auth on component mount
        initializeAuth();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        setError("");
        try {
            await login(email, password);
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword || !name) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        try {
            await register(email, password, name);
        } catch (err) {
            setError("Registration failed. Please try again.");
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError("");
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isAuthenticated ? (
                <View style={styles.loggedInContainer}>
                    <Text style={styles.title}>Welcome!</Text>
                    <Text style={styles.subtitle}>You are logged in</Text>
                    <Text style={styles.subtitle}></Text>
                    <TouchableOpacity style={styles.button} onPress={logout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.authContainer}>
                        <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        {!isLogin && (
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {!isLogin && (
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        )}

                        <TouchableOpacity style={styles.button} onPress={isLogin ? handleLogin : handleRegister}>
                            <Text style={styles.buttonText}>{isLogin ? "Login" : "Register"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.switchButton} onPress={toggleAuthMode}>
                            <Text style={styles.switchText}>
                                {isLogin ? "Need an account? Register" : "Already have an account? Login"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
    authContainer: {
        width: "100%",
    },
    loggedInContainer: {
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: "#007BFF",
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    switchButton: {
        padding: 10,
    },
    switchText: {
        color: "#007BFF",
        textAlign: "center",
    },
});
