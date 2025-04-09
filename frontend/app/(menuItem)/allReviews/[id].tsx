import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import ReviewPreview from "@/components/review/ReviewPreview";
import { ReviewButton } from "@/components/review/ReviewButton";
import { ReviewFlow } from "@/components/review/ReviewFlow";
import { useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AllReviews() {
    const [selectedMainFilter, setSelectedMainFilter] = React.useState("My Reviews");
    const [selectedSubFilter, setSelectedSubFilter] = React.useState("Portion");
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={[styles.scrollView, { paddingTop: insets.top }]}
                contentContainerStyle={[styles.scrollViewContent, { paddingBottom: insets.bottom }]}>
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
                                style={[
                                    styles.filterButton,
                                    selectedMainFilter === filter && styles.filterButtonActive,
                                ]}
                                onPress={() => setSelectedMainFilter(filter)}>
                                <ThemedText
                                    style={[
                                        styles.filterText,
                                        selectedMainFilter === filter && styles.filterTextActive,
                                    ]}>
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
                                    style={[
                                        styles.filterText,
                                        selectedSubFilter === filter && styles.filterTextActive,
                                    ]}>
                                    {filter}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <ReviewPreview
                        plateName="Plate Name"
                        restaurantName="Restaurant Name"
                        tags={["Vegan", "Healthy", "Green", "Low-Cal"]}
                        rating={4}
                        content="The Buddha Bowl at Green Garden exceeded my expectations! Fresh ingredients, perfectly balanced flavors, and generous portions make this a must-try for health-conscious diners. The avocado was perfectly ripe, and the quinoa was cooked to perfection. I especially loved the homemade tahini dressing."
                        authorName="John Doe"
                        authorUsername="johndoe"
                        authorAvatar="https://placehold.co/600x400/png?text=JD"
                        authorId="123"
                    />
                </ThemedView>
            </ScrollView>

            {/* Review Button positioned with safe area */}
            <View style={[styles.reviewButtonContainer, { paddingBottom: insets.bottom }]}>
                <ReviewButton
                    restaurantId="pad-thai-kitchen"
                    menuItemName="Pad Thai"
                    onPress={() => setIsReviewModalVisible(true)}
                />
            </View>

            <ReviewFlow
                isVisible={isReviewModalVisible}
                onClose={() => setIsReviewModalVisible(false)}
                restaurantId="pad-thai-kitchen"
                menuItemName="Pad Thai"
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
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
        fontSize: 20,
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
    reviewButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        paddingBottom: 16,
    },
});
