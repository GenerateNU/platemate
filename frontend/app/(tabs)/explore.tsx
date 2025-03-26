import { ScrollView } from "react-native";

import React from "react";
import RestaurantView from "@/app/RestaurantView";
import { OnboardingFlow } from "@/components/Onboarding/OnboardingFlow";

export default function ExploreScreen() {
    // return <RestaurantView />;
    // Onboarding flow
    return <OnboardingFlow onComplete={() => {}} />;
}
