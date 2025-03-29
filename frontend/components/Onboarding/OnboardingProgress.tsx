import React from "react";
import { View, StyleSheet } from "react-native";

interface OnboardingProgressProps {
    currentStep: number;
    totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
    return (
        <View style={styles.container}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.progressBar,
                        {
                            backgroundColor: index < currentStep ? "#000000" : "#D6D6D6",
                            flex: 1,
                        },
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 4,
        width: "100%",
        marginVertical: 16,
    },
    progressBar: {
        height: "100%",
        marginHorizontal: 2,
        borderRadius: 2,
    },
});
