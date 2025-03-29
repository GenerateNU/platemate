import { router } from "expo-router";
import React, { useEffect } from "react";
import { OnboardingFlow } from "@/components/Onboarding/OnboardingFlow";
import useAuthStore from "@/auth/store";

export default function OnboardingScreen() {
    const { isAuthenticated, register } = useAuthStore();

    // Use useEffect to handle navigation logic
    useEffect(() => {
        if (isAuthenticated) {
            // Navigate without rendering anything first
            router.replace("/(tabs)");
        }
    }, [isAuthenticated]);

    const handleOnboardingComplete = async (data: {
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
        dietaryRestrictions?: string[];
        cuisinePreferences?: string[];
    }) => {
        try {
            // Register the user with the collected data
            await register(data.email, data.password, data.name, data.username, data.preferences, data.restrictions);
            // The registration will automatically set isAuthenticated to true
            // which will trigger the navigation in the useEffect
        } catch (error) {
            console.error("Registration failed:", error);
            // TODO: Handle registration error (show error message to user)
        }
    };

    // If authenticated, return null to avoid rendering anything
    // This prevents the flash of content before navigation
    if (isAuthenticated) {
        return null;
    }

    // Only render the onboarding flow if not authenticated
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}
