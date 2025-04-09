import { useLocalSearchParams, useNavigation } from "expo-router";
import { ThemedView } from "@/components/themed/ThemedView";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed/ThemedText";
import { StarRating } from "@/components/ui/StarReview";
import React, { useEffect, useState } from "react";
import { TReview } from "@/types/review";
import { getReviewById } from "@/api/reviews";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMenuItemById } from "@/api/menu-items";
import { TMenuItem } from "@/types/menu-item";
import { getRestaurant } from "@/api/restaurant";
import { TRestaurant } from "@/types/restaurant";
import { Skeleton } from "moti/skeleton";
import { ThemedTag } from "@/components/themed/ThemedTag";

export default function Route() {
    const { id } = useLocalSearchParams<{
        id: string;
    }>();
    const [review, setReview] = useState<TReview | null>(null);
    const [menuItem, setMenuItem] = useState<TMenuItem | null>(null);
    const [restaurant, setRestaurant] = useState<TRestaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!id) {
                    throw new Error("Review ID is required");
                }

                const reviewData = await getReviewById(id);
                setReview(reviewData);

                if (reviewData?.menuItem) {
                    try {
                        const menuItemData = await getMenuItemById(reviewData.menuItem);
                        setMenuItem(menuItemData);

                        if (menuItemData?.restaurantId) {
                            try {
                                const restaurantData = await getRestaurant(menuItemData.restaurantId);
                                setRestaurant(restaurantData);
                            } catch (restError) {
                                console.error("Error fetching restaurant:", restError);
                            }
                        }
                    } catch (menuError) {
                        console.error("Error fetching menu item:", menuError);
                    }
                }

            } catch (mainError) {
                console.error("Error in data fetching:", mainError);
                setError(mainError instanceof Error ? mainError.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigation]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleUpvote = () => {
        console.log("Upvote");
    };

    const handleDownvote = () => {
        console.log("Downvote");
    };

    if (error) {
        return (
            <ThemedView style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <ThemedText>Go back</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ScrollView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
            <ThemedView style={styles.content}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Review for {review?.menuItemName}</ThemedText>
                </View>

                <View style={styles.userInfo}>
                        <Skeleton.Group show={loading}>
                            <View style={styles.userInfoLeft}>
                                <Skeleton colorMode={"light"}>
                                    <Image
                                        source={{ uri: review?.reviewer?.pfp || "https://placehold.co/100x100" }}
                                        style={styles.profilePicture}
                                    />
                                </Skeleton>
                                <Skeleton colorMode={"light"}>
                                    <ThemedView>
                                        <ThemedText style={styles.userName}>{review?.reviewer?.name || "User"}</ThemedText>
                                        <ThemedText style={styles.userHandle}>@{review?.reviewer?.username || "username"}</ThemedText>
                                    </ThemedView>
                                </Skeleton>
                            </View>
                        </Skeleton.Group>
                </View>

                <ThemedView style={{ marginBottom: 4, marginTop: 4 }}>
                    <Skeleton show={loading} colorMode={"light"}>
                        <View style={styles.tagsContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.scrollableTags}>
                                {["warm", "sweet", "tender", "fresh"].map((tag, index) => (
                                    <ThemedTag key={index} title={tag} backgroundColor={"#E8F5E9"} textColor={"#2E7D32"} />
                                ))}
                            </ScrollView>
                        </View>
                    </Skeleton>
                </ThemedView>

                <View style={styles.ratingsGridContainer}>
                    <View style={styles.ratingsGrid}>
                        <View style={styles.ratingColumn}>
                            <Skeleton show={loading} colorMode={"light"}>
                                <View style={styles.ratingBox}>
                                    <ThemedText style={styles.ratingTitle}>Overall</ThemedText>
                                    <StarRating
                                        avgRating={review?.rating?.overall || 0}
                                        numRatings={-1}
                                        showAvgRating={false}
                                        showNumRatings={false}
                                    />
                                    <ThemedText style={styles.ratingDescription}>
                                        This is the most supreme quality I've ever tasted.
                                    </ThemedText>
                                </View>
                            </Skeleton>
                            <Skeleton show={loading} colorMode={"light"}>
                                <View style={styles.ratingBox}>
                                    <ThemedText style={styles.ratingTitle}>Value</ThemedText>
                                    <StarRating
                                        avgRating={review?.rating?.value || 0}
                                        numRatings={-1}
                                        showAvgRating={false}
                                        showNumRatings={false}
                                    />
                                    <ThemedText style={styles.ratingDescription}>
                                        Decent, decent. Not too bad.
                                    </ThemedText>
                                </View>
                            </Skeleton>
                        </View>
                        <View style={[styles.ratingColumn, styles.ratingColumnRight]}>
                            <Skeleton show={loading} colorMode={"light"}>
                                <View style={styles.ratingBox}>
                                    <ThemedText style={styles.ratingTitle}>Taste</ThemedText>
                                    <StarRating
                                        avgRating={review?.rating?.taste || 0}
                                        numRatings={-1}
                                        showAvgRating={false}
                                        showNumRatings={false}
                                    />
                                    <ThemedText style={styles.ratingDescription}>
                                        It was pretty good. I would recommend it overall.
                                    </ThemedText>
                                </View>
                            </Skeleton>
                            <Skeleton show={loading} colorMode={"light"}>
                                <View style={styles.ratingBox}>
                                    <ThemedText style={styles.ratingTitle}>Portion</ThemedText>
                                    <StarRating
                                        avgRating={3}
                                        numRatings={-1}
                                        showAvgRating={false}
                                        showNumRatings={false}
                                        full
                                    />
                                    <ThemedText style={styles.ratingDescription}>
                                        S-tier. Would get every time I go here.
                                    </ThemedText>
                                </View>
                            </Skeleton>
                        </View>
                    </View>
                </View>

                <Skeleton show={loading} colorMode={"light"}>
                    <ThemedView style={{ marginVertical: 4 }}>
                        <ThemedText type={"subtitle"} style={{ lineHeight: 32, fontSize: 16 }}>Additional notes</ThemedText>
                        <ThemedText style={styles.reviewContent}>{review?.content || ""}</ThemedText>
                    </ThemedView>
                </Skeleton>

                {/*/!* Images *!/*/}
                {/*{review?.images && review.images.length > 0 && (*/}
                {/*    <ScrollView*/}
                {/*        horizontal*/}
                {/*        showsHorizontalScrollIndicator={false}*/}
                {/*        style={styles.imageScroll}*/}
                {/*        contentContainerStyle={styles.imageContainer}>*/}
                {/*        {review.images.map((image, index) => (*/}
                {/*            <Image key={index} source={{ uri: image }} style={styles.reviewImage} />*/}
                {/*        ))}*/}
                {/*    </ScrollView>*/}
                {/*)}*/}

                <ThemedView style={{ marginVertical: 8 }}>
                    <Skeleton show={loading} colorMode={"light"}>
                        <View style={styles.actionBar}>
                            <View style={styles.voteContainer}>
                                <TouchableOpacity onPress={handleUpvote}>
                                    <Entypo name="arrow-bold-up" size={32} color="black" />
                                </TouchableOpacity>
                                <ThemedText style={styles.voteCount}>{review?.metrics?.likes || 0}</ThemedText>
                                <TouchableOpacity onPress={handleDownvote}>
                                    <Entypo name="arrow-bold-down" size={32} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Entypo name="dots-three-vertical" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Skeleton>
                </ThemedView>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
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
        fontSize: 16,
        fontWeight: "600",
        textAlign: "left",
        fontFamily: "Nunito",
    },
    errorText: {
        color: "red",
        marginBottom: 20,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    userInfoLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    restaurantInfo: {
        marginBottom: 20,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "Source Sans 3",
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFD700",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        fontSize: 20,
        fontWeight: "600",
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Nunito",
        lineHeight: 20,
    },
    userHandle: {
        fontSize: 14,
        color: "#666",
        fontFamily: "Nunito",
        lineHeight: 16,
    },
    ratingsGridContainer: {
        marginBottom: 12,
        marginTop: 8,
        width: "100%",
    },
    ratingsGrid: {
        flexDirection: "row",
        width: "100%",
        gap: 24,
    },
    ratingColumn: {
        flex: 1,
        gap: 16,
    },
    ratingColumnRight: {
        alignItems: "flex-start",
    },
    ratingBox: {
        gap: 8,
        width: "100%",
        marginBottom: 10,
    },
    ratingTitle: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Nunito",
    },
    tagsContainer: {
        marginBottom: 4,
    },
    reviewContent: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 0,
        fontFamily: "Nunito",
    },
    imageScroll: {
        marginBottom: 24,
    },
    imageContainer: {
        gap: 12,
    },
    reviewImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
    },
    actionBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 8,
    },
    voteContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    voteCount: {
        fontSize: 16,
        fontWeight: "500",
    },
    actionButtons: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButton: {
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    actionCount: {
        fontSize: 14,
    },
    scrollableTags: {
        flexDirection: "row",
    },
    ratingDescription: {
        fontFamily: "Nunito",
        fontSize: 14,
        lineHeight: 16,
    },
    tag: {
        backgroundColor: "#fc0",
        color: "#000",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 12,
        fontFamily: "Source Sans 3",
    },
});