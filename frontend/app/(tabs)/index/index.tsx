import React, { useEffect, useState, useCallback, useContext } from "react";
import { FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, View } from "react-native";

import { ThemedView } from "@/components/themed/ThemedView";
import FeedTabs from "@/components/Feed/FeedTabs";
import ReviewPreview from "@/components/review/ReviewPreview";
import MenuItemPreview from "@/components/Cards/MenuItemPreview";
import { getMenuItemById, getMenuItems } from "@/api/menu-items";
import { TMenuItem } from "@/types/menu-item";
import { TReview } from "@/types/review";
import { getReviews } from "@/api/reviews";
import { getRestaurant } from "@/api/restaurant";
import { TRestaurant } from "@/types/restaurant";
import { useRouter } from "expo-router";
import { SearchBox } from "@/components/SearchBox";
import { SearchIcon } from "@/components/icons/Icons";
import { FilterContext } from "@/context/filter-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Define a type for our feed items
type FeedItem = {
    id: string;
    type: "review" | "menuItem";
    data: TReview | TMenuItem;
    menuItemData?: TMenuItem; // Store fetched menu item data
    restaurantData?: TRestaurant; // Store fetched restaurant data
};

export default function Feed() {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

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
        try {
            const [reviewsData, menuItemsData] = await Promise.all([
                getReviews(1, 10),
                getMenuItems({ page: 1, limit: 10 }),
            ]);

            const fetchedReviews = reviewsData.data as TReview[];
            const fetchedMenuItems = menuItemsData as TMenuItem[];

            // Create menu items map for quick lookup
            const menuItemsMap = fetchedMenuItems.reduce<Record<string, TMenuItem>>((acc, item) => {
                if (item.id) {
                    acc[item.id] = item;
                }
                return acc;
            }, {});

            // Track restaurant IDs we need to fetch
            const restaurantIds = new Set<string>();

            // Collect all restaurant IDs from reviews and menu items
            fetchedReviews.forEach(review => {
                if (review.restaurantId) {
                    restaurantIds.add(review.restaurantId);
                }
            });

            fetchedMenuItems.forEach(menuItem => {
                if (menuItem.restaurantId) {
                    restaurantIds.add(menuItem.restaurantId);
                }
            });

            // Fetch all restaurants in parallel
            const restaurantsPromises = Array.from(restaurantIds).map(async (id) => {
                try {
                    return { id, data: await getRestaurant(id) };
                } catch (error) {
                    console.error(`Error fetching restaurant ${id}:`, error);
                    return { id, data: undefined };
                }
            });

            const restaurantsResults = await Promise.all(restaurantsPromises);

            // Create restaurants map for quick lookup
            const restaurantsMap = restaurantsResults.reduce<Record<string, TRestaurant>>((acc, result) => {
                if (result.data) {
                    acc[result.id] = result.data;
                }
                return acc;
            }, {});

            // Create review feed items and fetch their menu items
            const reviewFeedItems: FeedItem[] = await Promise.all(
                fetchedReviews.map(async (review) => {
                    let menuItemData: TMenuItem | undefined;
                    let restaurantData: TRestaurant | undefined;

                    try {
                        // Get menu item data if available
                        if (review.menuItem && !menuItemsMap[review.menuItem]) {
                            menuItemData = await getMenuItemById(review.menuItem);
                        } else if (review.menuItem) {
                            menuItemData = menuItemsMap[review.menuItem];
                        }

                        // Get restaurant data from our map
                        if (review.restaurantId) {
                            restaurantData = restaurantsMap[review.restaurantId];
                        }
                    } catch (error) {
                        console.error(`Error fetching related data for review ${review._id}:`, error);
                    }

                    return {
                        id: review._id || `review-${Math.random().toString(36).substr(2, 9)}`,
                        type: "review" as const,
                        data: review,
                        menuItemData,
                        restaurantData,
                    };
                })
            );

            // Create menu item feed items with restaurant data
            const menuItemFeedItems: FeedItem[] = fetchedMenuItems.map((menuItem) => {
                let restaurantData: TRestaurant | undefined;

                if (menuItem.restaurantId) {
                    restaurantData = restaurantsMap[menuItem.restaurantId];
                }

                return {
                    id: menuItem.id || `menuItem-${Math.random().toString(36).substr(2, 9)}`,
                    type: "menuItem" as const,
                    data: menuItem,
                    restaurantData,
                };
            });

            // Combine and set all feed items
            setFeedItems([...reviewFeedItems, ...menuItemFeedItems]);
        } catch (error) {
            console.error("Error fetching data:", error);
            setFeedItems([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

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
            if (item.type === "review") {
                const review = item.data as TReview;
                // Use the pre-fetched data instead of fetching it here
                const plateName = item.menuItemData?.name || "Unknown Item";
                const restaurantName = item.restaurantData?.name || review.restaurantId || "Unknown Restaurant";

                return (
                    <TouchableOpacity onPress={() => router.push(`/(review)/${review._id}`)}>
                        <ReviewPreview
                            plateName={plateName}
                            restaurantName={restaurantName}
                            rating={review.rating?.overall || 0}
                            tags={["warm", "sharable", "spicy", "freshly made", "original"]}
                            content={review.content || ""}
                            authorName={review.reviewer?.id || "Anonymous"}
                            authorUsername={review.reviewer?.username || "user"}
                            authorAvatar={review.reviewer?.pfp || "https://placehold.co/100x100"}
                            authorId={review.reviewer?.id || "unknown"}
                        />
                    </TouchableOpacity>
                );
            } else if (item.type === "menuItem") {
                const menuItem = item.data as TMenuItem;
                const restaurantName = item.restaurantData?.name || menuItem.restaurantId || "Restaurant Name";

                return (
                    <TouchableOpacity onPress={() => router.push(`/(menuItem)/${menuItem.id}`)}>
                        <MenuItemPreview
                            plateName={menuItem.name || "Unknown Item"}
                            content={menuItem.description || ""}
                            tags={menuItem.tags || []}
                            picture={menuItem.picture || "https://placehold.co/300x200"}
                            rating={0}
                            restaurantName={restaurantName}
                        />
                    </TouchableOpacity>
                );
            }
            return null;
        },
        [router],
    );

    const ListHeaderComponent = useCallback(
        () => (
            <ThemedView style={{ alignItems: "center", paddingHorizontal: 8, paddingBottom: 12, gap: 12 }}>
                <FeedTabs tabs={["Friends", "Recommended"]} activeTab={activeTab} setActiveTab={setActiveTab} />
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
                contentContainerStyle={{ paddingBottom: 84 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <ThemedView style={{ paddingVertical: 20, alignItems: "center" }}>
                        <ThemedView>No content available</ThemedView>
                    </ThemedView>
                }
            />
        </ThemedView>
    );
}