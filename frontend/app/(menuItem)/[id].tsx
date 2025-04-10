import { ThemedView } from "@/components/themed/ThemedView";
import { ScrollView, StyleSheet, View, Image, Pressable, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import { StarRating } from "@/components/ui/StarReview";
import React, { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import ReviewPreview from "@/components/review/ReviewPreview";
import { ThemedTag } from "@/components/themed/ThemedTag";
import { ReviewButton } from "@/components/review/ReviewButton";
import HighlightCard from "@/components/restaurant/HighlightCard";
import { PersonWavingIcon, RestaurantIcon, SmileyIcon, ThumbsUpIcon } from "@/components/icons/Icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { getMenuItemById, getMenuItemReviews } from "@/api/menu-items";
import { TMenuItem } from "@/types/menu-item";
import ReviewFlow from "@/components/review/ReviewFlow";
import AddReviewButton from "@/components/AddReviewButton";
import { Skeleton } from "moti/skeleton";
import { useUser } from "@/context/user-context";
import { getRestaurantFriendsFav, getRestaurantSuperStars } from "@/api/restaurant";
import { FriendsFavInfo } from "@/types/restaurant";
import { TReview } from "@/types/review";

export default function Route() {
    const [selectedFilter, setSelectedFilter] = React.useState("My Reviews");
    const [friendsFav, setFriendsFav] = useState<FriendsFavInfo>({
        isFriendsFav: false,
        numFriends: 0,
    });
    const [superStars, setSuperStars] = useState(0); 
    const [menuItemReviews, setMenuItemReviews] = useState<TReview[]>([])

    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useUser();

    const navigation = useNavigation();
    const [menuItem, setMenuItem] = useState<TMenuItem | null>(null);

    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const fetchData = useCallback(async () => {
        try {
            if (!user || !menuItem) {
                console.log("USER", user);
                console.log("MENUITEM", menuItem);
                throw new Error("User and/or menuItem are null. Cannot fetch associated menu item data.");
            }
            const [friendsFavData, superStarsData, menuItemReviewData] = await Promise.all([getRestaurantFriendsFav(user.id, menuItem.restaurantID), getRestaurantSuperStars(menuItem.restaurantID), getMenuItemReviews(menuItem.id)]);
            console.log("MENUITEMID", menuItem);
            console.log("MENUREVIEWDATA", menuItemReviewData);
            console.log("FRIENDSFAVDATA", friendsFavData);
            setFriendsFav(friendsFavData);
            setSuperStars(superStarsData);
            setMenuItemReviews(menuItemReviewData);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [user, menuItem]);

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        getMenuItemById(id).then((data) => {
            setMenuItem(data);
            setLoading(false);
        });
    }, [navigation, id]);

    useEffect(() => {
        // Only call fetchData when menuItem is initialized
        if (menuItem) {
            fetchData();
        }
    }, [menuItem, user, fetchData]);

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Skeleton show={loading} colorMode={"light"}>
                    <ThemedView style={styles.bannerContainer}>
                        <Image source={{ uri: menuItem?.picture }} style={styles.bannerImage} />
                    </ThemedView>
                </Skeleton>
                <ThemedView style={styles.container}>
                    <Skeleton show={loading} colorMode={"light"}>
                        <ThemedView style={styles.headerContainer}>
                            <View style={styles.titleRow}>
                                <ThemedText style={styles.titleText} numberOfLines={1}>
                                    {menuItem?.name}
                                </ThemedText>
                            </View>
                            <View style={styles.restaurantContainer}>
                                <RestaurantIcon color={"#666"} width={20} height={20} />
                                <TouchableOpacity
                                    onPress={() => {
                                        router.push(`/(restaurant)/${menuItem?.restaurantID}`);
                                    }}>
                                    <ThemedText style={styles.restaurantText}>
                                        {menuItem?.restaurantName || "Restaurant Name"}
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ThemedView>
                    </Skeleton>

                    <Skeleton show={loading} colorMode={"light"}>
                        <ThemedView style={styles.tagsContainer}>
                            <View style={styles.tagRow}>
                                {menuItem?.tags.map((tag, index) => (
                                    <ThemedTag
                                        key={index}
                                        title={tag}
                                        backgroundColor={"#E8F5E9"}
                                        textColor={"#2E7D32"}
                                    />
                                ))}
                            </View>
                        </ThemedView>
                    </Skeleton>

                    <Skeleton show={loading} colorMode={"light"}>
                        <ThemedView style={styles.descriptionContainer}>
                            <ThemedText style={styles.descriptionText}>{menuItem?.description}</ThemedText>
                            <View style={styles.allergyRow}>
                                <View style={styles.allergyItemsContainer}>
                                    <ThemedText style={styles.allergyText} numberOfLines={1}>
                                        {menuItem?.dietaryRestrictions.join(", ") || "No known allergens."}
                                    </ThemedText>
                                </View>
                                <Pressable style={styles.allergyButton}>
                                    <ThemedText style={styles.viewAllText}>see allergens</ThemedText>
                                </Pressable>
                            </View>
                        </ThemedView>
                    </Skeleton>

                    <Skeleton show={loading} colorMode={"light"}>
                        <ThemedView style={styles.sectionHeader}>
                            <AddReviewButton onPress={() => setIsReviewModalVisible(true)} />
                            <ReviewFlow
                                isVisible={isReviewModalVisible}
                                onClose={() => setIsReviewModalVisible(false)}
                                restaurantId={menuItem?.restaurantID || ""}
                                menuItemName={menuItem?.name || ""}
                                dishImageUrl={menuItem?.picture || ""}
                            />
                        </ThemedView>
                    </Skeleton>

                    <Skeleton show={loading} colorMode={"light"}>
                        <ThemedView>
                            <View style={styles.sectionHeader}>
                                <ThemedText style={styles.sectionTitle}>Overall Ratings</ThemedText>
                            </View>
                            <View style={styles.statsContainer}>
                                <HighlightCard
                                    title={"Friend's Fav"}
                                    subtitle={`${friendsFav.numFriends} friend referrals`}
                                    icon={<PersonWavingIcon />}
                                />
                                <HighlightCard
                                    title={"Super Stars"}
                                    subtitle={`${superStars} 5-star reviews`}
                                    icon={<ThumbsUpIcon />}
                                />
                                <HighlightCard title={"Satisfaction"} subtitle={"100% of guests revisited"} icon={<SmileyIcon/>} />
                            </View>

                            <View style={styles.sectionHeader}>
                                <ThemedText style={styles.sectionTitle}>Reviews</ThemedText>
                                <Pressable onPress={() => router.push(`/(menuItem)/allReviews/${id}`)}>
                                    <ThemedText style={styles.viewAllText}>view all</ThemedText>
                                </Pressable>
                            </View>
                            <View style={styles.reviewStats}>
                                <View style={styles.ratingContainer}>
                                    <ThemedText style={styles.ratingText}>{menuItem?.avgRating.overall}</ThemedText>
                                    <StarRating avgRating={menuItem?.avgRating.overall || 0} numRatings={menuItemReviews.length} showAvgRating={false} />
                                </View>
                            </View>

                            <View style={styles.filterContainer}>
                                {["My Reviews", "Friends", "All"].map((filter) => (
                                    <Pressable
                                        key={filter}
                                        style={[
                                            styles.filterButton,
                                            selectedFilter === filter && styles.filterButtonActive,
                                        ]}
                                        onPress={() => setSelectedFilter(filter)}>
                                        <ThemedText
                                            style={[
                                                styles.filterText,
                                                selectedFilter === filter && styles.filterTextActive,
                                            ]}>
                                            {filter}
                                        </ThemedText>
                                    </Pressable>
                                ))}
                            </View>
                            {menuItemReviews.map((item: TReview, index: number) => (
                                <TouchableOpacity key={index} onPress={() => router.push(`/(review)/${item._id}`)}>
                                    <ReviewPreview
                                        plateName={item.menuItemName}
                                        restaurantName={item.restaurantName}
                                        // hard coded tags because we still do not have a tags fields for a review
                                        tags={["Crunchy", "Fresh"]}
                                        rating={item.rating.overall}
                                        content={item.content}
                                        authorName={item.reviewer.name}
                                        authorId={item.reviewer.id}
                                        authorUsername={item.reviewer.username}
                                        authorAvatar={item.reviewer.pfp}
                                    />
                                </TouchableOpacity>
                            ))} 
                        </ThemedView>
                    </Skeleton>
                </ThemedView>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    bannerContainer: {
        width: "100%",
        height: 200,
        overflow: "hidden",
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 24,
        marginTop: -30,
        backgroundColor: "white",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleIcons: {
        flexDirection: "row",
        gap: 8,
    },
    iconButton: {
        padding: 4,
    },
    headerContainer: {
        gap: 0,
    },
    titleText: {
        fontWeight: "600",
        fontFamily: "Source Sans 3",
        fontSize: 28,
        paddingTop: 16,
    },
    restaurantContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    restaurantText: {
        fontSize: 18,
        color: "#666",
    },
    tagsContainer: {
        paddingVertical: 12,
        pointerEvents: "none",
    },
    descriptionContainer: {
        gap: 8,
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 16,
        paddingTop: 4,
    },
    allergyLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#444",
        lineHeight: 18,
    },
    allergyText: {
        fontSize: 14,
        color: "#666",
        lineHeight: 18,
        flexShrink: 1,
    },
    allergyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    allergyItemsContainer: {
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 1,
        flexWrap: "wrap",
        maxWidth: "75%",
    },
    allergyButton: {
        paddingVertical: 0,
        paddingHorizontal: 8,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
    },
    viewAllText: {
        color: "#007AFF",
        textDecorationLine: "underline",
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 32,
    },
    statsIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    reviewStats: {
        marginBottom: 16,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    ratingText: {
        fontSize: 24,
        fontWeight: "600",
        lineHeight: 32,
    },
    reviewCount: {
        color: "#666",
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
    tagRow: {
        flexDirection: "row",
    },
});
