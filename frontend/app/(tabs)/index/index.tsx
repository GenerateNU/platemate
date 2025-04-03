import React, { useEffect, useState, useCallback } from "react";
import { FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, View } from "react-native";

import { ThemedView } from "@/components/themed/ThemedView";
import FeedTabs from "@/components/Feed/FeedTabs";
import ReviewPreview from "@/components/review/ReviewPreview";
import MenuItemPreview from "@/components/Cards/MenuItemPreview";
import { getMenuItems } from "@/api/menu-items";
import { TMenuItem } from "@/types/menu-item";
import { TReview } from "@/types/review";
import { getReviews } from "@/api/reviews";
import { useRouter } from "expo-router";
import { SearchBox } from "@/components/SearchBox";
import { SearchIcon } from "@/components/icons/Icons";
import { FilterContext } from "@/context/filter-context";
import { useContext } from "react";
import { SearchBoxFilter } from "@/components/SearchBoxFilter";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Feed() {
    const [activeTab, setActiveTab] = React.useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [menuItems, setMenuItems] = useState<TMenuItem[]>([]);
    const [reviews, setReviews] = useState<TReview[]>([]);
    const [data, setData] = useState<Array<TReview | TMenuItem>>([]);

    const insets = useSafeAreaInsets();

    const router = useRouter();
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("Filter component must be used within a FilterProvider");
    }
    const { handleSearch, searchText, setSearchText } = context;
    const handleSearchAndNavigate = () => {
        handleSearch();
        router.push("/search");
    };

    const fetchData = useCallback(async () => {
        try {
            const [reviewsData, menuItemsData] = await Promise.all([
                getReviews(1, 1),
                getMenuItems({ page: 1, limit: 1 }),
            ]);

            const fetchedReviews = reviewsData.data as TReview[];
            const fetchedMenuItems = menuItemsData as TMenuItem[];

            setReviews(fetchedReviews);
            setMenuItems(fetchedMenuItems);

            // Combine and prepare data for FlatList
            const combinedData = [];

            // Add reviews with type indicator
            fetchedReviews.forEach((review) => {
                combinedData.push({
                    ...review,
                    itemType: "review",
                });
            });

            // Add menu items with type indicator
            fetchedMenuItems.forEach((item) => {
                combinedData.push({
                    ...item,
                    itemType: "menuItem",
                });
            });

            setData(combinedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setReviews([]);
            setMenuItems([]);
            setData([]);
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
        ({ item }) => {
            if (item.itemType === "review") {
                return (
                    <TouchableOpacity onPress={() => router.push(`/(review)/${item._id}`)}>
                        <ReviewPreview
                            plateName={item.menuItem}
                            restaurantName={item.restaurantId}
                            rating={item.rating.overall}
                            tags={["Warm", "Tender", "Sweet"]}
                            content={item.content}
                            authorName={item.reviewer.id}
                            authorUsername={item.reviewer.username}
                            authorAvatar={item.reviewer.pfp}
                            authorId={item.reviewer.id}
                        />
                    </TouchableOpacity>
                );
            } else if (item.itemType === "menuItem") {
                return (
                    <TouchableOpacity onPress={() => router.push(`/(menuItem)/${item.id}`)}>
                        <MenuItemPreview
                            plateName={item.name}
                            content={item.description}
                            tags={item.tags}
                            picture={item.picture}
                            rating={3}
                            restaurantName={item.restaurantId || "Restaurant Name"}
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
        [activeTab, handleSearchAndNavigate, searchText, setSearchText],
    );

    const keyExtractor = useCallback((item) => {
        return item.itemType === "review" ? `review-${item._id}` : `menuItem-${item.id}`;
    }, []);

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
                        onSubmit={handleSearch}
                        value={searchText}
                        onChangeText={setSearchText}
                        filter={true}
                    />
                </ThemedView>
            </ThemedView>
            <FlatList
                data={data}
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
