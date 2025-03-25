import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import ReviewPreview from "./ReviewPreview";

export default function AllReviews() {
    const [selectedMainFilter, setSelectedMainFilter] = React.useState("My Reviews");
    const [selectedSubFilter, setSelectedSubFilter] = React.useState("Portion");

    const handleBack = () => {
        // Navigation logic here
        console.log("Go back");
    };

    return (
        <ScrollView style={styles.container}>
            <ThemedView style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>All Reviews</ThemedText>
                </View>

                {/* Main Filters */}
                <View style={styles.filterContainer}>
                    {["My Reviews", "Friends", "All"].map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterButton, selectedMainFilter === filter && styles.filterButtonActive]}
                            onPress={() => setSelectedMainFilter(filter)}>
                            <ThemedText
                                style={[styles.filterText, selectedMainFilter === filter && styles.filterTextActive]}>
                                {filter}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Sub Filters */}
                <View style={styles.filterContainer}>
                    {["Portion", "Taste", "Value", "Overall"].map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterButton, selectedSubFilter === filter && styles.filterButtonActive]}
                            onPress={() => setSelectedSubFilter(filter)}>
                            <ThemedText
                                style={[styles.filterText, selectedSubFilter === filter && styles.filterTextActive]}>
                                {filter}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Sample Review Preview */}
                <ReviewPreview
                    plateName="Pad Thai"
                    restaurantName="Pad Thai Kitchen"
                    tags={["Vegan", "Healthy", "Green", "Low-Cal"]}
                    rating={4}
                    content="The Buddha Bowl at Green Garden exceeded my expectations! Fresh ingredients, perfectly balanced flavors, and generous portions make this a must-try for health-conscious diners. The avocado was perfectly ripe, and the quinoa was cooked to perfection. I especially loved the homemade tahini dressing."
                />
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "600",
        textAlign: "left",
    },
    filterContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    filterButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "#f5f5f5",
    },
    filterButtonActive: {
        backgroundColor: "#FFD700",
    },
    filterText: {
        fontSize: 14,
    },
    filterTextActive: {
        fontWeight: "600",
    },
});
