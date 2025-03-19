import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";
import { Switch } from "react-native";

// TODO: Try to use the account settings screen for this

interface DietaryRestriction {
    id: string;
    name: string;
    description: string;
}

const DIETARY_RESTRICTIONS: DietaryRestriction[] = [
    { id: "vegetarian", name: "Vegetarian", description: "No meat, fish, or poultry" },
    { id: "vegan", name: "Vegan", description: "No animal products" },
    { id: "nut-free", name: "Nut-Free", description: "No nuts or nut products" },
    { id: "gluten-free", name: "Gluten-Free", description: "No wheat, barley, or rye" },
    { id: "dairy-free", name: "Dairy-Free", description: "No milk or dairy products" },
    { id: "halal", name: "Halal", description: "Halal dietary guidelines" },
    { id: "kosher", name: "Kosher", description: "Kosher dietary guidelines" },
];

interface DietaryRestrictionsScreenProps {
    onContinue: (restrictions: string[]) => void;
}

export function DietaryRestrictionsScreen({ onContinue }: DietaryRestrictionsScreenProps) {
    const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
    const { colors } = useTheme();

    const handleToggleRestriction = (restrictionId: string) => {
        setSelectedRestrictions((prev) => {
            if (prev.includes(restrictionId)) {
                return prev.filter((id) => id !== restrictionId);
            }
            return [...prev, restrictionId];
        });
    };

    const handleContinue = () => {
        onContinue(selectedRestrictions);
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText style={styles.header}>Any Dietary Restrictions?</ThemedText>

                <ScrollView style={styles.scrollView}>
                    {DIETARY_RESTRICTIONS.map((restriction) => (
                        <View key={restriction.id} style={styles.restrictionItem}>
                            <View style={styles.restrictionInfo}>
                                <ThemedText style={styles.restrictionName}>{restriction.name}</ThemedText>
                                <ThemedText style={styles.restrictionDescription}>{restriction.description}</ThemedText>
                            </View>
                            <Switch
                                value={selectedRestrictions.includes(restriction.id)}
                                onValueChange={() => handleToggleRestriction(restriction.id)}
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor={colors.background}
                            />
                        </View>
                    ))}
                </ScrollView>
                <Button
                    title="Continue"
                    onPress={handleContinue}
                    containerStyle={styles.button}
                    textStyle={styles.buttonText}
                />
            </View>
            <OnboardingProgress currentStep={5} totalSteps={6} />
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
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 24,
    },
    scrollView: {
        flex: 1,
        marginTop: 16,
    },
    restrictionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.1)",
    },
    restrictionInfo: {
        flex: 1,
        marginRight: 16,
    },
    restrictionName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    restrictionDescription: {
        fontSize: 14,
        opacity: 0.7,
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
