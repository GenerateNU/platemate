import { router } from "expo-router";
import React, { useEffect } from "react";
import { OnboardingFlow } from "@/components/Onboarding/OnboardingFlow";
import useAuthStore from "@/auth/store";

export default function OnboardingScreen() {
    const { isAuthenticated } = useAuthStore();

    // Use useEffect to handle navigation logic
    useEffect(() => {
        if (isAuthenticated) {
            // Navigate without rendering anything first
            router.replace("/(tabs)");
        }
    }, [isAuthenticated]);

    const handleOnboardingComplete = () => {
        // TODO: Handle actual auth here
        router.replace("/(tabs)");
        console.log("called");
    };

    // If authenticated, return null to avoid rendering anything
    // This prevents the flash of content before navigation
    if (isAuthenticated) {
        return null;
    }

    // Only render the onboarding flow if not authenticated
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}
