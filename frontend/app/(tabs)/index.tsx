import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";

import { ThemedView } from "@/components/themed/ThemedView";
import FeedTabs from "@/components/feed/FeedTabs";
import ReviewPreview from "@/components/review/ReviewPreview";
import MenuItemPreview from "@/components/Cards/MenuItemPreview";
import { Button } from "@/components/Button";
import { getMenuItems } from "@/api/menu-items";
import { TMenuItem } from "@/types/menu-item";
import { TReview } from "@/types/review";
import { getReviews } from "@/api/reviews";
import { useRouter } from "expo-router";

export default function Feed() {
    const [activeTab, setActiveTab] = React.useState(0);
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState<TMenuItem[]>([]);
    const [reviews, setReviews] = useState<TReview[]>([]);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        Promise.all([getReviews(1, 20), getMenuItems(1, 20)])
            .then(([reviewsData, menuItemsData]) => {
                setReviews(reviewsData.data);
                setMenuItems(menuItemsData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setReviews([]);
                setMenuItems([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }

    return (
        <ScrollView style={{ flex: 1, marginBottom: 84 }}>
            <ThemedView style={{ flex: 1, alignItems: "center", paddingHorizontal: 24, paddingVertical: 12, gap: 12 }}>
                <FeedTabs tabs={["Friends", "Recommended"]} activeTab={activeTab} setActiveTab={setActiveTab} />
                <ThemedView style={{ flex: 1, width: "100%", gap: 16 }}>
                    {reviews.length > 0 ? (
                        <ScrollView
                            horizontal
                            contentContainerStyle={{ gap: 16 }}
                            showsHorizontalScrollIndicator={false}>
                            {reviews.map((item: TReview, index: number) => (
                                <TouchableOpacity key={index} onPress={() => router.push(`/(review)/${item._id}`)}>
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
                            ))}
                        </ScrollView>
                    ) : (
                        <ThemedView style={{ paddingVertical: 20, alignItems: "center" }}>
                            <ThemedView>No reviews available</ThemedView>
                        </ThemedView>
                    )}

                    {menuItems.length > 0 && (
                        <ScrollView contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
                            {menuItems.map((item: TMenuItem, index: number) => (
                                <TouchableOpacity key={index} onPress={() => router.push(`/(menuItem)/${item.id}`)}>
                                    <MenuItemPreview
                                        plateName={item.name}
                                        content={item.description}
                                        tags={item.tags}
                                        picture={item.picture}
                                        rating={3}
                                        restaurantName={item.restaurantId || "Restaurant Name"}
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </ThemedView>
            </ThemedView>
            <ThemedView>
                <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Button title="Go to Filter" onPress={() => router.push("/filter")} />
                </ThemedView>
            </ThemedView>
        </ScrollView>
    );
}
