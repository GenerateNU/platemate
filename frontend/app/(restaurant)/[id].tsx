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
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { getRestaurant } from "@/api/restaurant";
import { TRestaurant } from "@/types/restaurant";
import { Skeleton } from "moti/skeleton";
import { getReviews } from "@/api/reviews";

export default function Route() {
    const restaurantTags = ["Fast Food", "Fried Chicken", "Chicken Sandwiches", "Order Online"];
    const [activeTab, setActiveTab] = React.useState(0);
    const [filterTab, setFilterTab] = React.useState(0);

    const router = useRouter();

    const { id } = useLocalSearchParams<{
        id: string;
    }>();

    const [restaurant, setRestaurant] = React.useState<TRestaurant | null>(null);
    const [loading, setLoading] = React.useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        getRestaurant(id).then(async (res) => {
            setRestaurant(res);
        });
        new Promise((resolve) => setTimeout(resolve, 1500)).then(() => setLoading(false));
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const formattedAddress = restaurant?.address.street + ", " + restaurant?.address.state;

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Skeleton show={loading} colorMode={"light"}>
                <BannerAndAvatar
                    bannerURL={restaurant?.banner || "https://placehold.co/600x400/png?text=B"}
                    avatarURL={restaurant?.picture || "https://placehold.co/600x400/png?text=P"}
                />
            </Skeleton>
            <Skeleton.Group show={loading}>
                <ThemedView style={styles.container}>
                    <Skeleton colorMode={"light"}>
                        <ThemedView style={styles.headerContainer}>
                            <ThemedText style={styles.titleText} numberOfLines={1}>
                                {restaurant?.name || "Restaurant Name"}
                            </ThemedText>
                        </ThemedView>
                    </Skeleton>

                    <Skeleton colorMode={"light"}>
                        <ThemedView style={styles.ratingContainer}>
                            <StarRating
                                avgRating={restaurant?.ratingAvg.overall || 3}
                                numRatings={500}
                                full={true}
                                starSize={20}
                            />
                        </ThemedView>
                    </Skeleton>

                    <Skeleton colorMode={"light"}>
                        <ThemedView style={styles.detailsContainer}>
                            <RestaurantDetailItem
                                text={formattedAddress || "360 Huntington Ave, Boston, MA 02115"}
                                icon={"marker"}
                            />
                        </ThemedView>
                    </Skeleton>

                    <Skeleton colorMode={"light"}>
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
                    </Skeleton>

                    <Skeleton colorMode={"light"}>
                        <RestaurantReviewSummary
                            rating={restaurant?.ratingAvg.overall}
                            friendsReviewCount={12}
                            highlight={"Cozy restaurant, friendly and attentive staff. My favorite part was..."}
                            maxRating={5}
                            reviewCount={189}
                        />
                    </Skeleton>

                    <Skeleton colorMode={"light"}>
                        <View style={styles.highlightsContainer}>
                            <HighlightCard
                                title={"Friend's Fav"}
                                subtitle={"100+ friend referrals"}
                                icon={<PersonWavingIcon />}
                            />
                            <HighlightCard
                                title={"Super Stars"}
                                subtitle={"200+ 5-star reviews"}
                                icon={<ThumbsUpIcon />}
                            />
                            <HighlightCard title={"Satisfaction"} subtitle={"70% of guests revisited"} />
                        </View>
                    </Skeleton>

                    <Skeleton colorMode={"light"}>
                        <FeedTabs tabs={["Reviews", "Menu"]} activeTab={filterTab} setActiveTab={setFilterTab} />
                    </Skeleton>

                    <Skeleton colorMode={"light"}>
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
                                    <TouchableOpacity onPress={() => router.push("/(review)/827b36v4b234")}>
                                        <ReviewPreview
                                            plateName={"Big Whopper"}
                                            reviewId={"827b36v4b234"}
                                            restaurantName={"Burger King"}
                                            tags={["juicy", "artificial", "fake meat"]}
                                            rating={4}
                                            content={
                                                "This is fake meat and is not good for you. Not sure why we are even serving it."
                                            }
                                            authorName={"First Last"}
                                            authorAvatar={"https://placehold.co/600x400/png?text=P"}
                                            authorUsername={"username"}
                                            authorId={""}
                                        />
                                    </TouchableOpacity>
                                </>
                            )}

                            {filterTab == 1 && <>{/* TODO MENU ITEM PREVIEW */}</>}
                        </ThemedView>
                    </Skeleton>
                </ThemedView>
            </Skeleton.Group>
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
        paddingTop: 4,
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
        gap: 4,
    },
    tagWrapper: {
        marginRight: 4,
    },
    chefsPickContainer: {
        paddingVertical: 4,
    },
    titleText: {
        fontWeight: "bold",
        fontFamily: "Nunito",
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
