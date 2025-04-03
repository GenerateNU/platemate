import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { LoginScreen } from "./LoginScreen";
import { NameScreen } from "./NameScreen";
import { EmailScreen } from "./EmailScreen";
import { PasswordScreen } from "./PasswordScreen";
import { UsernameScreen } from "./UsernameScreen";
import { DietaryRestrictionsScreen } from "./DietaryRestrictionsScreen";
import { CuisinePreferencesScreen } from "./CuisinePreferencesScreen";
import { CompletionScreen } from "./CompletionScreen";
import { LoadingScreen } from "./LoadingScreen";
import useAuthStore from "@/auth/store";

interface OnboardingData {
    name: string;
    email: string;
    password: string;
    username: string;
    dietaryRestrictions: string[];
    cuisinePreferences: string[];
    restrictions: string[];
    preferences: string[];
    profilePicture: string;
    followers: string[];
    following: string[];
    followersCount: number;
    followingCount: number;
    reviews: string[];
    count: number;
    refreshToken: string;
    tokenUsed: boolean;
    tasteProfile: number[];
}

interface OnboardingFlowProps {
    onComplete: (data: {
        name: string;
        email: string;
        password: string;
        username: string;
        restrictions: string[];
        preferences: string[];
        profilePicture: string;
        followers: string[];
        following: string[];
        followersCount: number;
        followingCount: number;
        reviews: string[];
        count: number;
        refreshToken: string;
        tokenUsed: boolean;
        tasteProfile: number[];
    }) => void;
}

type Screen = "login" | "name" | "email" | "password" | "username" | "dietary" | "cuisine" | "complete" | "loading";

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const [currentScreen, setCurrentScreen] = useState<Screen>("login");
    const [data, setData] = useState<OnboardingData>({
        name: "",
        email: "",
        password: "",
        username: "",
        dietaryRestrictions: [],
        cuisinePreferences: [],
        restrictions: [],
        preferences: [],
        profilePicture: "",
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0,
        reviews: [],
        count: 0,
        refreshToken: "",
        tokenUsed: false,
        tasteProfile: [],
    });

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (error: any) {
            Alert.alert("Login Failed", error.response?.data?.message || "An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNameSubmit = (name: string) => {
        setData((prev) => ({ ...prev, name }));
        setCurrentScreen("email");
    };

    const handleEmailSubmit = (email: string) => {
        setData((prev) => ({ ...prev, email }));
        setCurrentScreen("password");
    };

    const handlePasswordSubmit = (password: string) => {
        setData((prev) => ({ ...prev, password }));
        setCurrentScreen("username");
    };

    const handleUsernameSubmit = (username: string) => {
        setData((prev) => ({ ...prev, username }));
        setCurrentScreen("dietary");
    };

    const handleDietarySubmit = (restrictions: string[]) => {
        setData((prev) => ({
            ...prev,
            dietaryRestrictions: restrictions,
            restrictions: restrictions,
        }));
        setCurrentScreen("cuisine");
    };

    const handleCuisineSubmit = (preferences: string[]) => {
        setData((prev) => ({
            ...prev,
            cuisinePreferences: preferences,
            preferences: preferences,
        }));
        setCurrentScreen("complete");
    };

    const handleComplete = () => {
        // Validate required fields before completing
        if (!data.name || !data.email || !data.password || !data.username) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        // Create the complete user data with all required fields
        const finalUserData = {
            ...data,
            // Ensure these are properly set
            restrictions: data.dietaryRestrictions,
            preferences: data.cuisinePreferences,
            // Ensure default values for required fields
            followingCount: parseFloat(0),
            followersCount: parseFloat(0),
            count: 0,
            reviews: [],
            following: [],
            followers: [],
            profilePicture: data.profilePicture || "",
            refreshToken: "",
            tokenUsed: false,
            // Initialize taste profile if not already set
            tasteProfile: data.tasteProfile.length === 0 ? new Array(1536).fill(0) : data.tasteProfile,
        };

        // Send the complete data
        onComplete(finalUserData);
    };

    const handleNavigateToOnboarding = () => {
        setCurrentScreen("name");
    };

    const handleNavigateToLogin = () => {
        setCurrentScreen("login");
    };

    const handleBack = () => {
        switch (currentScreen) {
            case "email":
                setCurrentScreen("name");
                break;
            case "password":
                setCurrentScreen("email");
                break;
            case "username":
                setCurrentScreen("password");
                break;
            case "dietary":
                setCurrentScreen("username");
                break;
            case "cuisine":
                setCurrentScreen("dietary");
                break;
            default:
                break;
        }
    };

    const renderScreen = () => {
        if (isLoading) {
            return <LoadingScreen />;
        }

        switch (currentScreen) {
            case "login":
                return <LoginScreen onLogin={handleLogin} onNavigateToOnboarding={handleNavigateToOnboarding} />;
            case "name":
                return <NameScreen onContinue={handleNameSubmit} onNavigateToLogin={handleNavigateToLogin} />;
            case "email":
                return (
                    <EmailScreen
                        onContinue={handleEmailSubmit}
                        onNavigateToLogin={handleNavigateToLogin}
                        onBack={handleBack}
                    />
                );
            case "password":
                return <PasswordScreen onContinue={handlePasswordSubmit} onBack={handleBack} />;
            case "username":
                return <UsernameScreen onContinue={handleUsernameSubmit} onBack={handleBack} />;
            case "dietary":
                return <DietaryRestrictionsScreen onContinue={handleDietarySubmit} onBack={handleBack} />;
            case "cuisine":
                return <CuisinePreferencesScreen onContinue={handleCuisineSubmit} onBack={handleBack} />;
            case "complete":
                return <CompletionScreen onComplete={handleComplete} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>{renderScreen()}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white",
    },
    container: {
        flex: 1,
    },
});
