import { Button, ScrollView, View } from "react-native";

import React from "react";
import RestaurantView from "@/app/RestaurantView";
import { OnboardingFlow } from "@/components/Onboarding/OnboardingFlow";

export default function ExploreScreen() {
    const [showOnboarding, setShowOnboarding] = React.useState(false);

    const handleOnboardingComplete = (data: any) => {
        console.log("Onboarding completed:", data);
        setShowOnboarding(false);
    };

    if (showOnboarding) {
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
    }

    return (
        <View>
            <Button title="Start Onboarding" onPress={() => setShowOnboarding(true)} />
        </View>
    );
}
