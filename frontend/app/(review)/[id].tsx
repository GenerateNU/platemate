import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { ThemedView } from "@/components/themed/ThemedView";
import ReviewDetail from "@/components/review/ReviewDetail";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed/ThemedText";
import { StarRating } from "@/components/ui/StarReview";
import React, { useEffect } from "react";
import { TReview } from "@/types/review";
import { getReviewById } from "@/api/reviews";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ReviewDocument = {
    _id: string;
    createdAt: string;
    updatedAt: string;
    user: {
        _id: string;
        name: string;
        username: string;
        avatarUrl: string;
    };
    dish: {
        _id: string;
        name: string;
        restaurant: {
            _id: string;
            name: string;
        };
    };
    ratings: {
        overall: number;
        taste: number;
        value: number;
        portion: number;
    };
    tags: string[];
    content: string;
    images: string[];
    metrics: {
        likes: number;
        comments: number;
        shares: number;
    };
};

// Mock data
const mockReview: ReviewDocument = {
    _id: "review123",
    createdAt: "2024-03-20T10:30:00Z",
    updatedAt: "2024-03-20T10:30:00Z",
    user: {
        _id: "user123",
        name: "Anna Liu",
        username: "Annaliuc",
        avatarUrl: "https://avatars.githubusercontent.com/u/66958528?v=4",
    },
    dish: {
        _id: "dish123",
        name: "Buddha Bowl",
        restaurant: {
            _id: "rest123",
            name: "Green Garden",
        },
    },
    ratings: {
        overall: 4,
        taste: 4,
        value: 4,
        portion: 4,
    },
    tags: ["Vegan", "Healthy", "Green", "Low-Cal"],
    content:
        "The Buddha Bowl at Green Garden exceeded my expectations! Fresh ingredients, perfectly balanced flavors, and generous portions make this a must-try for health-conscious diners. The avocado was perfectly ripe, and the quinoa was cooked to perfection. I especially loved the homemade tahini dressing.",
    images: [
        "https://avatars.githubusercontent.com/u/66958528?v=4",
        "https://avatars.githubusercontent.com/u/66958528?v=4",
        "https://avatars.githubusercontent.com/u/66958528?v=4",
    ],
    metrics: {
        likes: 123,
        comments: 45,
        shares: 12,
    },
};

export default function Route() {
    const { id } = useLocalSearchParams<{
        id: string;
    }>();
    const [review, setReview] = React.useState<TReview | null>(null);

    const navigation = useNavigation();

    useEffect(() => {
        getReviewById(id).then((res) => {
            setReview(res);
        });
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleUpvote = () => {
        console.log("Upvote");
    };

    const handleDownvote = () => {
        console.log("Downvote");
    };

    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
            <ThemedView style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Review Detail</ThemedText>
                </View>

                {/* User Info */}
                <View style={styles.userInfo}>
                    <View style={styles.userInfoLeft}>
                        <Image source={{ uri: review?.reviewer.pfp }} style={styles.profilePicture} />
                        <View>
                            <ThemedText style={styles.userName}>{review?.reviewer.username}</ThemedText>
                            <ThemedText style={styles.userHandle}>@{review?.reviewer.username}</ThemedText>
                        </View>
                    </View>
                </View>
                <View style={{ paddingBottom: 12 }}>
                    <TouchableOpacity
                        onPress={() => {
                            router.push(`/(menuItem)/${review?.menuItem}`);
                        }}>
                        <ThemedText type="title">{review?.menuItemName}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            router.push(`/(restaurant)/${review?.restaurantId}`);
                        }}>
                        <ThemedText type="default">at {review?.restaurantName}</ThemedText>
                    </TouchableOpacity>
                </View>
                {/* Tags */}
                <View style={styles.tagsContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollableTags}>
                        {mockReview.tags.map((tag, index) => (
                            <ThemedText key={index} style={styles.tag}>
                                {tag}
                            </ThemedText>
                        ))}
                    </ScrollView>
                </View>
                {/* Ratings Grid */}
                <View style={styles.ratingsGridContainer}>
                    <View style={styles.ratingsGrid}>
                        <View style={styles.ratingColumn}>
                            <View style={styles.ratingBox}>
                                <ThemedText style={styles.ratingTitle}>Overall</ThemedText>
                                <StarRating
                                    avgRating={4.2}
                                    numRatings={-1}
                                    showAvgRating={false}
                                    showNumRatings={false}
                                />
                            </View>
                            <View style={styles.ratingBox}>
                                <ThemedText style={styles.ratingTitle}>Value</ThemedText>
                                <StarRating
                                    avgRating={4.4}
                                    numRatings={-1}
                                    showAvgRating={false}
                                    showNumRatings={false}
                                />
                            </View>
                        </View>
                        <View style={[styles.ratingColumn, styles.ratingColumnRight]}>
                            <View style={styles.ratingBox}>
                                <ThemedText style={styles.ratingTitle}>Taste</ThemedText>
                                <StarRating
                                    avgRating={mockReview.ratings.taste}
                                    numRatings={-1}
                                    showAvgRating={false}
                                    showNumRatings={false}
                                />
                            </View>
                            <View style={styles.ratingBox}>
                                <ThemedText style={styles.ratingTitle}>Portion</ThemedText>
                                <StarRating
                                    avgRating={mockReview.ratings.portion}
                                    numRatings={-1}
                                    showAvgRating={false}
                                    showNumRatings={false}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <ThemedText style={styles.reviewContent}>{review?.content}</ThemedText>

                {/* Images */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.imageScroll}
                    contentContainerStyle={styles.imageContainer}>
                    {mockReview.images.map((image, index) => (
                        <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
                    ))}
                </ScrollView>

                {/* Action Bar */}
                <View style={styles.actionBar}>
                    <View style={styles.voteContainer}>
                        <TouchableOpacity>
                            <Entypo name="arrow-with-circle-up" size={32} color="black" />
                        </TouchableOpacity>
                        <ThemedText style={styles.voteCount}>{mockReview.metrics.likes}</ThemedText>
                        <TouchableOpacity>
                            <Entypo name="arrow-with-circle-down" size={32} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="chatbubble-outline" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Entypo name="dots-three-vertical" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
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
        fontSize: 16,
        fontWeight: "600",
        textAlign: "left",
        fontFamily: "Source Sans 3",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    userInfoLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
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
        fontFamily: "Source Sans 3",
    },
    userHandle: {
        fontSize: 14,
        color: "#666",
        fontFamily: "Source Sans 3",
    },
    ratingsGridContainer: {
        marginBottom: 24,
        width: "100%",
    },
    ratingsGrid: {
        flexDirection: "row",
        width: "85%",
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
        minWidth: 120,
    },
    ratingTitle: {
        fontSize: 16,
        fontWeight: "500",
        fontFamily: "Source Sans 3",
    },
    tagsContainer: {
        marginBottom: 24,
    },
    reviewContent: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
        fontFamily: "Source Sans 3",
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
        gap: 12,
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
    },
    scrollableTags: {
        flexDirection: "row",
        gap: 8,
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
