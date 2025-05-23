import { ThemedView } from "@/components/themed/ThemedView";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import React, { useEffect } from "react";

import { PersonWavingIcon, PhoneIcon, ThumbsUpIcon, WebsiteIcon } from "@/components/icons/Icons";
import { RestaurantDetailItem } from "@/components/restaurant/RestaurantDetailItem";
import BannerAndAvatar from "@/components/restaurant/RestaurantBanner";
import Tag from "@/components/ui/Tag";
import { StarRating } from "@/components/ui/StarReview";
import RestaurantReviewSummary from "@/components/restaurant/RestaurantReviewSummary";
import HighlightCard from "@/components/restaurant/HighlightCard";
import FeedTabs from "@/components/Feed/FeedTabs";
import ReviewPreview from "@/components/review/ReviewPreview";
import MenuItemPreview from "@/components/Cards/MenuItemPreview";
import { useRouter } from "expo-router";
import { getRestaurant } from "@/api/restaurant";
import { TRestaurant } from "@/types/restaurant";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RestaurantView() {
    const restaurantTags = ["Fast Food", "Fried Chicken", "Chicken Sandwiches", "Order Online"];
    const [activeTab, setActiveTab] = React.useState(0);
    const [filterTab, setFilterTab] = React.useState(0);
    const insets = useSafeAreaInsets();

    const router = useRouter();

    const id = "67e22ab00387c709ab3f77f4";
    const [restaurant, setRestaurant] = React.useState<TRestaurant | null>(null);

    useEffect(() => {
        getRestaurant(id).then((res) => {
            setRestaurant(res);
        });
    }, []);

    const formattedAddress =
        restaurant?.address.street +
        ", " +
        restaurant?.address.city +
        ", " +
        restaurant?.address.state +
        " " +
        restaurant?.address.zipcode;

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: insets.top }}>
            <BannerAndAvatar
                bannerURL={"https://shorturl.at/zZdqT"}
                avatarURL={restaurant?.picture || "https://shorturl.at/Yn9SH"}
            />
            <ThemedView style={styles.container}>
                <ThemedView style={styles.headerContainer}>
                    <ThemedText style={styles.titleText}>{restaurant?.name}</ThemedText>
                    <View style={styles.iconContainer}>
                        <PhoneIcon />
                        <WebsiteIcon />
                    </View>
                </ThemedView>

                <ThemedView style={styles.ratingContainer}>
                    <StarRating avgRating={1.9} numRatings={500} full={true} />
                </ThemedView>

                <ThemedView style={styles.detailsContainer}>
                    <RestaurantDetailItem
                        text={formattedAddress || "360 Huntington Ave, Boston, MA 02115"}
                        icon={"marker"}
                    />
                    <RestaurantDetailItem text={"Open | Closes 8 PM"} icon={"clock"} />
                </ThemedView>

                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tagsScrollViewContent}>
                    {restaurant?.tags.map((tag, index) => (
                        <View key={index} style={index < restaurantTags.length - 1 ? styles.tagWrapper : null}>
                            <Tag text={tag} />
                        </View>
                    ))}
                </ScrollView>

                <RestaurantReviewSummary
                    rating={restaurant?.ratingAvg.overall}
                    friendsReviewCount={12}
                    highlight={"This is a really good dish. I liked the part when the chef added the sauce..."}
                    maxRating={5}
                    reviewCount={189}
                />

                <View style={styles.highlightsContainer}>
                    <HighlightCard
                        title={"Friend's Fave"}
                        subtitle={"100+ friend referrals"}
                        icon={<PersonWavingIcon />}
                    />
                    <HighlightCard title={"Super Stars"} subtitle={"200+ 5-star reviews"} icon={<ThumbsUpIcon />} />
                    <HighlightCard title={"Satisfaction"} subtitle={"70% of guests revisited"} />
                </View>

                <FeedTabs tabs={["Reviews", "Menu"]} activeTab={filterTab} setActiveTab={setFilterTab} />

                <ThemedView>
                    {filterTab == 0 && (
                        <>
                            <ThemedView style={{ paddingVertical: 12 }}>
                                <FeedTabs
                                    tabs={["Friends", "Top Reviews", "My Reviews"]}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                />
                            </ThemedView>
                            <TouchableOpacity onPress={() => router.push(`/(review)/${"827b36v4b234"}` as any)}>
                                <ReviewPreview
                                    plateName={"Big Whopper"}
                                    reviewId={"827b36v4b234"}
                                    restaurantName={"Burger King"}
                                    tags={["juicy", "artificial", "fake meat"]}
                                    rating={4}
                                    content={
                                        "This is fake meat and is not good for you. Not sure why we are even serving it."
                                    }
                                    authorAvatar={"https://placehold.co/600x400/png?text=P"}
                                    authorName={"First Last"}
                                    authorUsername={"username"}
                                    authorId={""}
                                />
                            </TouchableOpacity>
                        </>
                    )}

                    {filterTab == 1 && <>{/* TODO MENU ITEM PREVIEW */}</>}
                </ThemedView>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    bannerContainer: {
        width: "100%",
        position: "relative",
        alignItems: "flex-start",
        backgroundColor: "white",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    detailsContainer: {
        paddingVertical: 4,
        gap: 4,
    },
    ratingContainer: {
        paddingVertical: 8,
    },
    tagsScrollViewContent: {
        flexDirection: "row",
        paddingTop: 8,
        paddingBottom: 12,
    },
    tagWrapper: {
        marginRight: 4,
    },
    chefsPickContainer: {
        paddingVertical: 4,
    },
    titleText: {
        fontWeight: "bold",
        fontFamily: "Source Sans 3",
        fontSize: 28,
        paddingTop: 6,
    },
    iconContainer: {
        flexDirection: "row",
        gap: 16,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 96,
        marginTop: -30,
        backgroundColor: "white",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    highlightsContainer: {
        flex: 1,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
});
