import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import HighlightCard from "@/components/restaurant/HighlightCard";
import { SmileyIcon, ThumbsUpIcon, StarIcon } from "@/components/icons/Icons";
import { useLocalSearchParams } from "expo-router";
import { getRestaurantMenuItemsMetrics } from "@/api/menu-items";
import { TRestaurantMenuItemsMetrics } from "@/types/restaurant";
import { TMenuItemMetrics } from "@/types/menu-item";
import useAuthStore from "@/auth/store";

const RestaurantAnalytics = () => {
    const insets = useSafeAreaInsets();
    const { ownedRestaurantId } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<TRestaurantMenuItemsMetrics | null>(null);
    const [averageRating, setAverageRating] = useState(0);
    const [topDish, setTopDish] = useState<TMenuItemMetrics | null>(null);
    const [returnRate, setReturnRate] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!ownedRestaurantId) {
                setError("No restaurant ID provided");
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const metricsData = await getRestaurantMenuItemsMetrics(ownedRestaurantId);
                setMetrics(metricsData);

                // Calculate average rating across all menu items
                if (metricsData.menu_item_metrics.length > 0) {
                    const totalRating = metricsData.menu_item_metrics.reduce(
                        (acc, item) => acc + item.overall_rating,
                        0,
                    );
                    const avgRating = parseFloat((totalRating / metricsData.menu_item_metrics.length).toFixed(1));
                    setAverageRating(avgRating);

                    // Find top dish by overall rating
                    const sortedDishes = [...metricsData.menu_item_metrics].sort(
                        (a, b) => b.overall_rating - a.overall_rating,
                    );
                    setTopDish(sortedDishes[0]);

                    // Calculate average return rate
                    const totalReturnRate = metricsData.menu_item_metrics.reduce(
                        (acc, item) => acc + item.return_rate,
                        0,
                    );
                    const avgReturnRate = parseFloat(
                        (totalReturnRate / metricsData.menu_item_metrics.length).toFixed(1),
                    );
                    setReturnRate(avgReturnRate);
                }
            } catch (err) {
                console.error("Error fetching restaurant metrics:", err);
                setError("Failed to load restaurant analytics data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ownedRestaurantId]);

    // Render a dish row
    const renderDishRow = (dish: TMenuItemMetrics) => {
        return (
            <View key={dish.id} style={styles.dishRow}>
                <View style={styles.dishInfo}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.reviewText}>{dish.review_count} reviews</Text>
                </View>

                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>{dish.overall_rating.toFixed(1)}</Text>
                    <StarIcon width={16} height={16} color="#F7B418" filled={true} />
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F7B418" />
                <ThemedText style={styles.loadingText}>Loading analytics data...</ThemedText>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
            </ThemedView>
        );
    }

    if (!metrics) {
        return (
            <ThemedView style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>No data available</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}>
                <ThemedView style={styles.headerContainer}>
                    <ThemedText style={styles.headerTitle}>Restaurant Analytics</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>Performance Dashboard</ThemedText>
                </ThemedView>

                {/* Summary Cards */}
                <View style={styles.summaryCards}>
                    <View style={styles.summaryRow}>
                        <HighlightCard
                            title="Overall Rating"
                            subtitle={`${averageRating.toFixed(1)} / 5.0`}
                            icon={<StarIcon width={24} height={24} color="#F7B418" filled={true} />}
                            backgroundColor="#F7F9FC"
                        />
                        <HighlightCard
                            title="Total Reviews"
                            subtitle={`${metrics.total_reviews}`}
                            icon={<ThumbsUpIcon />}
                            backgroundColor="#F7F9FC"
                        />
                    </View>
                    <View style={styles.summaryRow}>
                        <HighlightCard
                            title="Top Dish"
                            subtitle={topDish ? topDish.name : "N/A"}
                            icon={<SmileyIcon />}
                            backgroundColor="#F7F9FC"
                        />
                        <HighlightCard
                            title="Return Rate"
                            subtitle={`${returnRate.toFixed(1)}%`}
                            backgroundColor="#F7F9FC"
                        />
                    </View>
                </View>

                {/* Dishes List */}
                <View style={styles.dishesContainer}>
                    <ThemedText style={styles.sectionTitle}>Menu Items Performance</ThemedText>
                    <View style={styles.dishList}>
                        {metrics.menu_item_metrics.length > 0 ? (
                            metrics.menu_item_metrics
                                .sort((a, b) => b.overall_rating - a.overall_rating)
                                .map((dish) => renderDishRow(dish))
                        ) : (
                            <ThemedText style={styles.noDataText}>No menu items data available</ThemedText>
                        )}
                    </View>
                </View>

                {/* Tags Section */}
                {metrics.menu_item_metrics.length > 0 && metrics.menu_item_metrics[0].popular_tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        <ThemedText style={styles.sectionTitle}>Popular Tags</ThemedText>
                        <View style={styles.tagsList}>
                            {metrics.menu_item_metrics
                                .flatMap((item) => item.popular_tags)
                                .filter((tag, index, self) => self.indexOf(tag) === index)
                                .slice(0, 10)
                                .map((tag, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                        </View>
                    </View>
                )}

                {/* Dietary Restrictions */}
                {metrics.menu_item_metrics.length > 0 &&
                    metrics.menu_item_metrics[0].dietary_restrictions.length > 0 && (
                        <View style={styles.tagsContainer}>
                            <ThemedText style={styles.sectionTitle}>Dietary Options</ThemedText>
                            <View style={styles.tagsList}>
                                {metrics.menu_item_metrics
                                    .flatMap((item) => item.dietary_restrictions)
                                    .filter((restriction, index, self) => self.indexOf(restriction) === index)
                                    .map((restriction, index) => (
                                        <View key={index} style={[styles.tag, styles.dietaryTag]}>
                                            <Text style={styles.tagText}>{restriction}</Text>
                                        </View>
                                    ))}
                            </View>
                        </View>
                    )}
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    headerContainer: {
        marginBottom: 16,
    },
    headerTitle: {
        fontFamily: "Source Sans 3",
        fontSize: 24,
        fontWeight: "bold",
        color: "#151619",
    },
    headerSubtitle: {
        fontFamily: "Source Sans 3",
        fontSize: 16,
        color: "#727272",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    errorText: {
        fontSize: 16,
        color: "#e53935",
        textAlign: "center",
    },
    noDataText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        padding: 16,
    },
    summaryCards: {
        marginBottom: 24,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: "Source Sans 3",
        fontSize: 18,
        fontWeight: "bold",
        color: "#151619",
        marginBottom: 16,
    },
    dishesContainer: {
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    dishList: {
        gap: 12,
    },
    dishRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "white",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    dishInfo: {
        flex: 1,
    },
    dishName: {
        fontFamily: "Source Sans 3",
        fontSize: 16,
        fontWeight: "600",
        color: "#151619",
        marginBottom: 4,
    },
    reviewText: {
        fontFamily: "Source Sans 3",
        fontSize: 14,
        color: "#727272",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF8E1",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    ratingText: {
        fontFamily: "Source Sans 3",
        fontSize: 14,
        fontWeight: "bold",
        color: "#F7B418",
        marginRight: 4,
    },
    tagsContainer: {
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    tagsList: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    tag: {
        backgroundColor: "#FFCF0F",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    dietaryTag: {
        backgroundColor: "#E8F5E9", // Different color for dietary restrictions
    },
    tagText: {
        fontFamily: "Source Sans 3",
        fontSize: 14,
        fontWeight: "500",
        color: "#151619",
    },
});

export default RestaurantAnalytics;
