import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import ReviewPreview from "./ReviewPreview";
import { ReviewButton } from "@/components/review/ReviewButton";
import { ReviewFlow } from "@/components/review/ReviewFlow";
import { getUserReviews, getFriendsReviews, getReviews } from "@/api/reviews";
import { TReview } from "@/types/review";
import useAuthStore from "@/auth/store";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

export default function AllReviews() {
    const [selectedMainFilter, setSelectedMainFilter] = React.useState("My Reviews");
    const [selectedSubFilter, setSelectedSubFilter] = React.useState("Portion");
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [reviews, setReviews] = useState<TReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { userId } = useAuthStore();

    // TODO: Get the actual user ID from your auth context/state
    const currentUserId = userId || "";

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null);

                if (selectedMainFilter === "My Reviews") {
                    const userReviews = await getUserReviews(currentUserId);
                    setReviews(userReviews);
                } else if (selectedMainFilter === "Friends") {
                    // TODO: Implement friends reviews fetch
                    const friendReviews = await getFriendsReviews(currentUserId);
                    setReviews(friendReviews);
                } else {
                    const allReviews = await getReviews();
                    setReviews(allReviews.data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [selectedMainFilter, currentUserId]);

    const handleBack = () => {
        navigation.goBack();
    };

    // Sort reviews based on selectedSubFilter
    const sortedReviews = [...reviews].sort((a, b) => {
        if (selectedSubFilter === "Portion") {
            return b.rating.portion - a.rating.portion;
        } else if (selectedSubFilter === "Taste") {
            return b.rating.taste - a.rating.taste;
        } else if (selectedSubFilter === "Value") {
            return b.rating.value - a.rating.value;
        } else {
            return b.rating.overall - a.rating.overall;
        }
    });

    return (
        <>
            <ScrollView style={styles.container}>
                <ThemedView style={[styles.content, { paddingTop: insets.top }]}>
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

                    {/* Reviews List */}
                    {loading ? (
                        <ThemedText style={styles.messageText}>Loading reviews...</ThemedText>
                    ) : error ? (
                        <ThemedText style={styles.errorText}>{error}</ThemedText>
                    ) : sortedReviews.length === 0 ? (
                        <ThemedText style={styles.messageText}>No reviews found</ThemedText>
                    ) : (
                        sortedReviews.map((review) => (
                            <ReviewPreview
                                key={review._id}
                                reviewId={review._id}
                                plateName={review.menuItemName}
                                restaurantName={review.restaurantName}
                                tags={[]}
                                rating={review.rating.overall}
                                content={review.content}
                                authorName={review.reviewer.username}
                                authorId={review.reviewer._id}
                                authorUsername={review.reviewer.username}
                                authorAvatar={review.reviewer.pfp || "https://placehold.co/600x400/png?text=P"}
                            />
                        ))
                    )}
                </ThemedView>
            </ScrollView>
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
                menuItemId={id}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        position: "relative",
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
    messageText: {
        textAlign: "center",
        marginVertical: 20,
        color: "#666",
    },
    errorText: {
        textAlign: "center",
        marginVertical: 20,
        color: "red",
    },
    reviewButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
});
