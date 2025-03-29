import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";
import { sharedOnboardingStyles } from "./onboardingStyles";
import { ChevronLeft } from "@/components/icons/Icons";

interface Cuisine {
    id: string;
    name: string;
}

const CUISINES: Cuisine[] = [
    { id: "american", name: "American" },
    { id: "italian", name: "Italian" },
    { id: "chinese", name: "Chinese" },
    { id: "japanese", name: "Japanese" },
    { id: "mexican", name: "Mexican" },
    { id: "indian", name: "Indian" },
    { id: "thai", name: "Thai" },
    { id: "mediterranean", name: "Mediterranean" },
    { id: "greek", name: "Greek" },
    { id: "vietnamese", name: "Vietnamese" },
    { id: "korean", name: "Korean" },
    { id: "caribbean", name: "Caribbean" },
];

interface CuisinePreferencesScreenProps {
    onContinue: (preferences: string[]) => void;
    onBack: () => void;
}

export function CuisinePreferencesScreen({ onContinue, onBack }: CuisinePreferencesScreenProps) {
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const { colors } = useTheme();

    const handleToggleCuisine = (cuisineId: string) => {
        setSelectedCuisines((prev) => {
            if (prev.includes(cuisineId)) {
                return prev.filter((id) => id !== cuisineId);
            }
            return [...prev, cuisineId];
        });
    };

    const handleContinue = () => {
        onContinue(selectedCuisines);
    };

    return (
        <ThemedView style={[sharedOnboardingStyles.container, { paddingTop: 70 }]}>
            <TouchableOpacity style={sharedOnboardingStyles.backButton} onPress={onBack}>
                <ChevronLeft width={24} height={24} />
            </TouchableOpacity>
            <View style={sharedOnboardingStyles.content}>
                <View style={sharedOnboardingStyles.headerContainer}>
                    <ThemedText style={sharedOnboardingStyles.header}>Any Cuisine Preferences?</ThemedText>
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.grid}>
                        {CUISINES.map((cuisine) => (
                            <TouchableOpacity
                                key={cuisine.id}
                                style={[
                                    styles.cuisineButton,
                                    {
                                        backgroundColor: selectedCuisines.includes(cuisine.id)
                                            ? "#FFCF0F"
                                            : colors.card,
                                        borderColor: "#F7B418",
                                    },
                                ]}
                                onPress={() => handleToggleCuisine(cuisine.id)}>
                                <ThemedText
                                    style={[
                                        styles.cuisineText,
                                        {
                                            color: selectedCuisines.includes(cuisine.id) ? "#000000" : colors.text,
                                        },
                                    ]}>
                                    {cuisine.name}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <Button
                title="Continue"
                onPress={handleContinue}
                containerStyle={sharedOnboardingStyles.button}
                textStyle={sharedOnboardingStyles.buttonText}
            />
            <OnboardingProgress currentStep={6} totalSteps={6} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginTop: 16,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        paddingBottom: 24,
    },
    cuisineButton: {
        width: "47%",
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cuisineText: {
        fontSize: 16,
        fontWeight: "500",
    },
});
