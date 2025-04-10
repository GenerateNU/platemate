import React, { useEffect, useState, useCallback, useContext } from "react";
import { FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, View, ScrollView } from "react-native";

import { ThemedView } from "@/components/themed/ThemedView";
import FeedTabs from "@/components/Feed/FeedTabs";
import ReviewPreview from "@/components/review/ReviewPreview";
import MenuItemPreview from "@/components/Cards/MenuItemPreview";
import { getMenuItems, getRandomMenuItems } from "@/api/menu-items";
import { TMenuItem } from "@/types/menu-item";
import { TReview } from "@/types/review";
import { getReviews } from "@/api/reviews";
import { useRouter } from "expo-router";
import { SearchBox } from "@/components/SearchBox";
import { SearchIcon } from "@/components/icons/Icons";
import { FilterContext } from "@/context/filter-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed/ThemedText";
import { getFriendsReviews } from "@/api/reviews";
import { useUser } from "@/context/user-context";


// Define a type for our feed items
type FeedItem = {
    id: string;
    type: "review" | "menuItem";
    data: TReview | TMenuItem;
};

export default function Feed() {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [reviews, setReviews] = useState<TReview[]>([]);
    const [menuItems, setMenuItems] = useState<TMenuItem[]>([]);
    const { user } = useUser();

    const insets = useSafeAreaInsets();
    const router = useRouter();

    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("Filter component must be used within a FilterProvider");
    }
    const { handleSearch, searchText, setSearchText } = context;

    const handleSearchAndNavigate = useCallback(() => {
        handleSearch();
        router.push("/search");
    }, [handleSearch, router]);

    const fetchData = useCallback(async () => {
        console.log("FETCH DATA STARTING, activeTab:", activeTab);
        console.log("User object:", user); // Log the entire user object
        try {
            let reviewsData;
            if (activeTab === 0) {
                if (!user) {
                    // Fallback to regular reviews if user is not available TODO: maybe better way
                    const response = await getReviews(1, 20);
                    reviewsData = response;
                } else {
                    const userId = user.id;
                    reviewsData = await getFriendsReviews(userId);
                }

            } else {
                reviewsData = await getReviews(1, 20);

            }

            const menuItemsData = await getRandomMenuItems(20);
            const fetchedReviews = reviewsData?.data as TReview[] || [];
            const fetchedMenuItems = menuItemsData as TMenuItem[];

            setReviews(fetchedReviews);
            setMenuItems(fetchedMenuItems);

            // Create a new array of FeedItems for the vertical list (now only menu items)
            const newFeedItems: FeedItem[] = [
                ...fetchedMenuItems.map((menuItem) => ({
                    id: menuItem.id || `menuItem-${Math.random().toString(36).substr(2, 9)}`,
                    type: "menuItem" as const,
                    data: menuItem,
                })),
            ];

            setFeedItems(newFeedItems);
        } catch (error) {
            console.error("Error fetching data:", error);
            setFeedItems([]);
            setReviews([]);
            setMenuItems([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab, user]);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [fetchData]);

    const renderItem = useCallback(
        ({ item }: { item: FeedItem }) => {
            if (item.type === "menuItem") {
                const menuItem = item.data as TMenuItem;
                return (
                    <MenuItemPreview
                        id={menuItem.id}
                        plateName={menuItem.name || "Unknown Item"}
                        content={menuItem.description || ""}
                        tags={menuItem.tags || []}
                        picture={menuItem.picture || "https://placehold.co/300x200"}
                        rating={menuItem.avgRating?.overall ?? 0}
                        restaurantName={menuItem.restaurantName || "Restaurant Name"}
                    />
                );
            }
            return null;
        },
        [router],
    );

    const renderReviewItem = useCallback(
        (review: TReview) => {
            return (
                <TouchableOpacity
                    key={review._id}
                    onPress={() => router.push(`/(review)/${review._id}`)}
                    style={{ width: 300, marginRight: 16 }}>
                    <ReviewPreview
                        plateName={review.menuItemName || "Unknown Item"}
                        restaurantName={review.restaurantName || "Unknown Restaurant"}
                        rating={review.rating?.overall || 0}
                        tags={["Warm", "Tender", "Sweet"]}
                        content={review.content || ""}
                        authorName={review.reviewer.name || "Anonymous"}
                        authorUsername={review.reviewer?.username || "user"}
                        authorAvatar={review.reviewer?.pfp || "https://placehold.co/100x100"}
                        authorId={review.reviewer?.id || "unknown"}
                    />
                </TouchableOpacity>
            );
        },
        [router],
    );

    const ListHeaderComponent = useCallback(
        () => (
            <ThemedView style={{ width: "100%", alignItems: "center", paddingBottom: 12, gap: 4 }}>
                <FeedTabs tabs={["Friends", "Recommended"]} activeTab={activeTab} setActiveTab={setActiveTab} />

                <ThemedView style={{ width: "100%", marginVertical: 20 }}>
                    <ThemedView style={{ paddingBottom: 12, paddingHorizontal: 8 }}>
                        <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>Reviews for you</ThemedText>
                    </ThemedView>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 8, paddingRight: 24 }}>
                        {reviews.length > 0 ? (
                            reviews.map(renderReviewItem)
                        ) : (
                            <ThemedView style={{ padding: 16, alignItems: "center", justifyContent: "center" }}>
                                <ThemedView style={{ paddingVertical: 20, alignItems: "center" }}>
                                    <ThemedText>No content available</ThemedText>
                                </ThemedView>
                            </ThemedView>
                        )}
                    </ScrollView>
                </ThemedView>
                <ThemedView style={{ paddingHorizontal: 8, alignSelf: "flex-start" }}>
                    <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>Your friends ate</ThemedText>
                </ThemedView>
            </ThemedView>
        ),
        [activeTab, reviews, renderReviewItem],
    );

    const keyExtractor = useCallback((item: FeedItem) => item.id, []);

    if (loading) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{ paddingTop: insets.top, paddingHorizontal: 24, flex: 1 }}>
            <ThemedView style={{ alignItems: "center", paddingHorizontal: 0, paddingVertical: 12, gap: 12 }}>
                <ThemedView style={{ width: "100%" }}>
                    <SearchBox
                        icon={<SearchIcon />}
                        placeholder="What are you hungry for?"
                        recent={true}
                        name="general"
                        onSubmit={handleSearchAndNavigate}
                        value={searchText}
                        onChangeText={setSearchText}
                        filter={true}
                    />
                </ThemedView>
            </ThemedView>
            <FlatList
                data={feedItems}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={ListHeaderComponent}
                // ListHeaderComponent={() => ( TODO: DELETE
                //     <ListHeaderComponent key={activeTab} />
                //   )}
                contentContainerStyle={{ paddingBottom: 84 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <ThemedView style={{ paddingVertical: 20, alignItems: "center" }}>
                         <ThemedText>No content available</ThemedText>
                    </ThemedView>
                }
            />
        </ThemedView>
    );
}
