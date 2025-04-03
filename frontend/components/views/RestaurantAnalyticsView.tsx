import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import HighlightCard from "@/components/restaurant/HighlightCard";
import { SmileyIcon, ThumbsUpIcon, StarIcon } from "@/components/icons/Icons";

// A simple type for dish analytics
type DishAnalytics = {
    id: string;
    name: string;
    averageRating: {
        overall: number;
        taste: number;
        value: number;
        portion: number;
    };
    reviewCount: number;
    returningPercentage: number;
};

const RestaurantAnalyticsView = () => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [dishes, setDishes] = useState<DishAnalytics[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [returningCustomerPercentage, setReturningCustomerPercentage] = useState(0);

    // Mock data fetching
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                // In a real app, this would be an API call
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Sample data
                const dishesData: DishAnalytics[] = [
                    {
                        id: "1",
                        name: "Pad Thai",
                        averageRating: {
                            overall: 4.5,
                            taste: 4.7,
                            value: 4.3,
                            portion: 4.4,
                        },
                        reviewCount: 128,
                        returningPercentage: 66,
                    },
                    {
                        id: "2",
                        name: "Green Curry",
                        averageRating: {
                            overall: 4.2,
                            taste: 4.4,
                            value: 4.0,
                            portion: 4.1,
                        },
                        reviewCount: 96,
                        returningPercentage: 64,
                    },
                    {
                        id: "3",
                        name: "Mango Sticky Rice",
                        averageRating: {
                            overall: 4.7,
                            taste: 4.9,
                            value: 4.4,
                            portion: 4.6,
                        },
                        reviewCount: 87,
                        returningPercentage: 82,
                    },
                    {
                        id: "4",
                        name: "Tom Yum Soup",
                        averageRating: {
                            overall: 4.3,
                            taste: 4.5,
                            value: 4.2,
                            portion: 4.0,
                        },
                        reviewCount: 76,
                        returningPercentage: 63,
                    },
                    {
                        id: "5",
                        name: "Papaya Salad",
                        averageRating: {
                            overall: 4.1,
                            taste: 4.3,
                            value: 4.0,
                            portion: 3.9,
                        },
                        reviewCount: 68,
                        returningPercentage: 59,
                    },
                ];

                setDishes(dishesData);

                // Calculate summary metrics
                const avgRating = parseFloat(
                    (dishesData.reduce((acc, dish) => acc + dish.averageRating.overall, 0) / dishesData.length).toFixed(
                        1,
                    ),
                );
                setAverageRating(avgRating);

                const reviews = dishesData.reduce((acc, dish) => acc + dish.reviewCount, 0);
                setTotalReviews(reviews);

                const returnRate = parseFloat(
                    (dishesData.reduce((acc, dish) => acc + dish.returningPercentage, 0) / dishesData.length).toFixed(
                        1,
                    ),
                );
                setReturningCustomerPercentage(returnRate);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Render a dish row
    const renderDishRow = (dish: DishAnalytics) => {
        return (
            <View key={dish.id} style={styles.dishRow}>
                <View style={styles.dishInfo}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.reviewText}>{dish.reviewCount} reviews</Text>
                </View>

                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>{dish.averageRating.overall.toFixed(1)}</Text>
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

    return (
        <ThemedView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
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
                            subtitle={`${averageRating} / 5.0`}
                            icon={<StarIcon width={24} height={24} color="#F7B418" filled={true} />}
                            backgroundColor="#F7F9FC"
                        />
                        <HighlightCard
                            title="Total Reviews"
                            subtitle={`${totalReviews}`}
                            icon={<ThumbsUpIcon />}
                            backgroundColor="#F7F9FC"
                        />
                    </View>
                    <View style={styles.summaryRow}>
                        <HighlightCard
                            title="Top Dish"
                            subtitle={
                                dishes.length > 0
                                    ? dishes.sort((a, b) => b.averageRating.overall - a.averageRating.overall)[0].name
                                    : "N/A"
                            }
                            icon={<SmileyIcon />}
                            backgroundColor="#F7F9FC"
                        />
                        <HighlightCard
                            title="Return Rate"
                            subtitle={`${returningCustomerPercentage}%`}
                            backgroundColor="#F7F9FC"
                        />
                    </View>
                </View>

                {/* Dishes List */}
                <View style={styles.dishesContainer}>
                    <ThemedText style={styles.sectionTitle}>Best Performing Dishes</ThemedText>
                    <View style={styles.dishList}>{dishes.map((dish) => renderDishRow(dish))}</View>
                </View>
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
        marginVertical: 8,
    },
    headerTitle: {
        fontFamily: "Source Sans 3",
        fontSize: 24,
        fontWeight: "bold",
        color: "#151619",
        lineHeight: 30,
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
    summaryCards: {
        marginBottom: 12,
        marginTop: 12,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
        gap: 16,
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
});

export default RestaurantAnalyticsView;
