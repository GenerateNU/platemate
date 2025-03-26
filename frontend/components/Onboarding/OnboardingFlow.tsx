import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { LoginScreen } from "./LoginScreen";
import { NameScreen } from "./NameScreen";
import { EmailScreen } from "./EmailScreen";
import { PasswordScreen } from "./PasswordScreen";
import { UsernameScreen } from "./UsernameScreen";
import { DietaryRestrictionsScreen } from "./DietaryRestrictionsScreen";
import { CuisinePreferencesScreen } from "./CuisinePreferencesScreen";
import { CompletionScreen } from "./CompletionScreen";

interface OnboardingData {
    name: string;
    email: string;
    password: string;
    username: string;
    dietaryRestrictions: string[];
    cuisinePreferences: string[];
}

interface OnboardingFlowProps {
    onComplete: (data: OnboardingData) => void;
}

type Screen = "login" | "name" | "email" | "password" | "username" | "dietary" | "cuisine" | "complete";

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const [currentScreen, setCurrentScreen] = useState<Screen>("login");
    const [data, setData] = useState<OnboardingData>({
        name: "",
        email: "",
        password: "",
        username: "",
        dietaryRestrictions: [],
        cuisinePreferences: [],
    });

    const handleLogin = (email: string, password: string) => {
        // TODO: Implement actual login logic
        console.log("Login:", { email, password });
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
        setData((prev) => ({ ...prev, dietaryRestrictions: restrictions }));
        setCurrentScreen("cuisine");
    };

    const handleCuisineSubmit = (preferences: string[]) => {
        setData((prev) => ({ ...prev, cuisinePreferences: preferences }));
        setCurrentScreen("complete");
    };

    const handleComplete = () => {
        onComplete(data);
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
    },
    container: {
        flex: 1,
    },
});

// Example Usage:
// import React, { useState } from "react";
// import { ScrollView, View, StyleSheet } from "react-native";
// import { OnboardingFlow } from "../../components/Onboarding/OnboardingFlow";
// import { Button } from "../../components/Button";

// const ExampleScreen = () => {
//     const [showOnboarding, setShowOnboarding] = useState(false);

//     const handleOnboardingComplete = (data: any) => {
//         console.log("Onboarding completed:", data);
//         setShowOnboarding(false);
//     };

//     if (showOnboarding) {
//         return <OnboardingFlow onComplete={handleOnboardingComplete} />;
//     }

//     return (
//         <ScrollView contentContainerStyle={{ padding: 1 }}>
//             <View>
//                 <Button
//                     title="Start Onboarding"
//                     onPress={() => setShowOnboarding(true)}
//                 />
//             </View>
//         </ScrollView>
//     );
// };
