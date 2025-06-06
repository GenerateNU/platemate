import React, { useEffect, useState, useCallback, useContext } from "react";
import { FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, View, ScrollView } from "react-native";

import { ThemedView } from "@/components/themed/ThemedView";
import FeedTabs from "@/components/Feed/FeedTabs";
import ReviewPreview from "@/components/review/ReviewPreview";
import MenuItemPreview from "@/components/Cards/MenuItemPreview";
import { getMenuItems, getRecommendations } from "@/api/menu-items";
import { TMenuItem } from "@/types/menu-item";
import { TReview } from "@/types/review";
import { getReviews } from "@/api/reviews";
import { useRouter } from "expo-router";
import { SearchBox } from "@/components/SearchBox";
import { SearchIcon } from "@/components/icons/Icons";
import { FilterContext } from "@/context/filter-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuthStore from "@/auth/store";
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
        console.log(activeTab);
        try {
            let reviewsData;
            if (activeTab === 0) {
                if (!user) {
                    // Fallback to regular reviews if user is not available TODO: maybe better way
                    const response = await getReviews(1, 10);
                    reviewsData = response;
                } else {
                    const userId = user.id;
                    reviewsData = await getFriendsReviews(userId);
                }
            } else {
                reviewsData = await getReviews(1, 10);
            }

            const menuItemsData = await getMenuItems({ page: 1, limit: 10 });
            const fetchedReviews = (reviewsData?.data as TReview[]) || [];
            const fetchedMenuItems = menuItemsData as TMenuItem[];

            switch (activeTab) {
                case 0:
                    // Create a new array of FeedItems
                    const newFeedItems: FeedItem[] = [
                        ...fetchedReviews.map((review) => ({
                            id: review._id || `review-${Math.random().toString(36).substr(2, 9)}`,
                            type: "review" as const,
                            data: review,
                        })),
                        ...fetchedMenuItems.map((menuItem) => ({
                            id: menuItem.id || `menuItem-${Math.random().toString(36).substr(2, 9)}`,
                            type: "menuItem" as const,
                            data: menuItem,
                        })),
                    ];

                    setFeedItems(newFeedItems);
                    break;
                case 1:
                    if (!user) {
                        setFeedItems([]);
                        break;
                    }
                    // use the recommendations endpoint to get the top 10 items
                    const topItems = await getRecommendations(user?.id);
                    // convert top items _id to id
                    topItems.forEach((item) => (item.id = item.id));
                    console.log(topItems);
                    setFeedItems(topItems.map((item) => ({ id: item.id, type: "menuItem", data: item })));
                    break;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setFeedItems([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab, user]);

    useEffect(() => {
        setLoading(true);

        if (user) {
            fetchData();
        }
    }, [fetchData, user]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [fetchData]);

    const renderItem = useCallback(
        ({ item }: { item: FeedItem }) => {
            if (item.type === "review") {
                const review = item.data as TReview;
                return (
                    <ReviewPreview
                        reviewId={review._id}
                        plateName={review.menuItemName || "Unknown Item"}
                        restaurantName={review.restaurantName || "Unknown Restaurant"}
                        rating={review.rating?.overall || 0}
                        likes={review.likes}
                        tags={["Warm", "Tender", "Sweet"]}
                        content={review.content || ""}
                        authorName={review.reviewer?.username || "Anonymous"}
                        authorUsername={review.reviewer?.username || "user"}
                        authorAvatar={review.reviewer.pfp || "https://placehold.co/100x100"}
                        authorId={review.reviewer?._id || "unknown"}
                    />
                );
            } else if (item.type === "menuItem") {
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
    const ListHeaderComponent = useCallback(
        () => (
            <ThemedView style={{ alignItems: "center", paddingHorizontal: 8, paddingBottom: 12, gap: 12 }}>
                <FeedTabs
                    tabs={["Friends", "Recommended"]}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    callback={fetchData}
                />
            </ThemedView>
        ),
        [activeTab],
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
                <View style={{ width: "100%" }}>
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
                </View>
            </ThemedView>
            <FlatList
                data={feedItems}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={ListHeaderComponent}
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
