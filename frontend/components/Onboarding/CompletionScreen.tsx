import React from "react";
import { View } from "react-native";
import { Button } from "../Button";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";
import { sharedOnboardingStyles } from "./onboardingStyles";

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
