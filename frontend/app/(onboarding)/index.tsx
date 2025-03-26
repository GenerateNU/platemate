import { router } from "expo-router";
import React from "react";
import { OnboardingFlow } from "@/components/Onboarding/OnboardingFlow";

export default function OnboardingScreen() {
    const handleOnboardingComplete = () => {
        // TODO: Handle actual auth here
        router.replace("/(tabs)");
    };

    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}
