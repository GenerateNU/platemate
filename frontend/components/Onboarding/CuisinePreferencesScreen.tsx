import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";

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
}

export function CuisinePreferencesScreen({ onContinue }: CuisinePreferencesScreenProps) {
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
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText style={styles.header}>Any Cuisine Preferences?</ThemedText>

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
                <Button
                    title="Continue"
                    onPress={handleContinue}
                    containerStyle={styles.button}
                    textStyle={styles.buttonText}
                />
                <OnboardingProgress currentStep={6} totalSteps={6} />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        flex: 1,
        marginBottom: 32,
    },
    header: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 24,
    },
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
    button: {
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFCF0F",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
