import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Button } from "../Button";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { OnboardingProgress } from "./OnboardingProgress";
import ToggleOff from "@/assets/icons/toggle_off.svg";
import ToggleOn from "@/assets/icons/toggle_on.svg";
import { ChevronLeft } from "@/components/icons/Icons";
import { sharedOnboardingStyles } from "./onboardingStyles";

interface DietaryRestriction {
    id: string;
    name: string;
    description: string;
}

const DIETARY_RESTRICTIONS: DietaryRestriction[] = [
    { id: "vegetarian", name: "Vegetarian", description: "No meat, fish, or poultry" },
    { id: "vegan", name: "Vegan", description: "No animal products" },
    { id: "nutFree", name: "Nut-Free", description: "No nuts or nut products" },
    { id: "shellfishAllergy", name: "Shellfish-Free", description: "No shellfish or shellfish products" },
    { id: "glutenFree", name: "Gluten-Free", description: "No wheat, barley, or rye" },
    { id: "dairyFree", name: "Dairy-Free", description: "No milk or dairy products" },
    { id: "kosher", name: "Kosher", description: "Kosher dietary guidelines" },
    { id: "halal", name: "Halal", description: "Halal dietary guidelines" },
    { id: "pescatarian", name: "Pescatarian", description: "Fish but no other meat" },
    { id: "keto", name: "Keto", description: "Low-carb, high-fat diet" },
    { id: "diabetic", name: "Diabetic", description: "Suitable for diabetics" },
    { id: "soyFree", name: "Soy-Free", description: "No soy or soy products" },
    { id: "porkFree", name: "Pork-Free", description: "No pork or pork products" },
    { id: "beefFree", name: "Beef-Free", description: "No beef or beef products" },
];

interface DietaryRestrictionsScreenProps {
    onContinue: (restrictions: string[]) => void;
    onBack: () => void;
}

const Toggle = ({ value, onValueChange }: { value: boolean; onValueChange: (newValue: boolean) => void }) => {
    return (
        <TouchableOpacity onPress={() => onValueChange(!value)}>
            {value ? <ToggleOn width={40} height={24} /> : <ToggleOff width={40} height={24} />}
        </TouchableOpacity>
    );
};

export function DietaryRestrictionsScreen({ onContinue, onBack }: DietaryRestrictionsScreenProps) {
    const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

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
        <ThemedView style={[sharedOnboardingStyles.container, { paddingTop: 70 }]}>
            <TouchableOpacity style={sharedOnboardingStyles.backButton} onPress={onBack}>
                <ChevronLeft width={24} height={24} />
            </TouchableOpacity>
            <View style={sharedOnboardingStyles.content}>
                <View style={sharedOnboardingStyles.headerContainer}>
                    <ThemedText style={sharedOnboardingStyles.header}>Any Dietary Restrictions?</ThemedText>
                </View>

                <ScrollView style={styles.scrollView}>
                    {DIETARY_RESTRICTIONS.map((restriction) => (
                        <View key={restriction.id} style={styles.restrictionItem}>
                            <View style={styles.restrictionInfo}>
                                <ThemedText style={styles.restrictionName}>{restriction.name}</ThemedText>
                                <ThemedText style={styles.restrictionDescription}>{restriction.description}</ThemedText>
                            </View>
                            <Toggle
                                value={selectedRestrictions.includes(restriction.id)}
                                onValueChange={() => handleToggleRestriction(restriction.id)}
                            />
                        </View>
                    ))}
                </ScrollView>
                <Button
                    title="Continue"
                    onPress={handleContinue}
                    containerStyle={sharedOnboardingStyles.button}
                    textStyle={sharedOnboardingStyles.buttonText}
                />
            </View>
            <OnboardingProgress currentStep={5} totalSteps={6} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
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
});
