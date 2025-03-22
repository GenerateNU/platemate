import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";
import { sharedOnboardingStyles } from "./onboardingStyles";

// TODO: Will this open up to recommended page?
// How will the app know location - will it automate location request to see things near the new user

interface CompletionScreenProps {
    onComplete: () => void;
}

export function CompletionScreen({ onComplete }: CompletionScreenProps) {
    return (
        <ThemedView style={[sharedOnboardingStyles.container]}>
            <View style={sharedOnboardingStyles.content}>
                <ThemedText style={sharedOnboardingStyles.header}>All Set!</ThemedText>
                <ThemedText style={sharedOnboardingStyles.subtext}>Explore PlateMate</ThemedText>

                <Button
                    title="Let's Go"
                    onPress={onComplete}
                    containerStyle={sharedOnboardingStyles.button}
                    textStyle={sharedOnboardingStyles.buttonText}
                />
            </View>
            <OnboardingProgress currentStep={6} totalSteps={6} />
        </ThemedView>
    );
}
