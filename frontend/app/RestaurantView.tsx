import { ThemedView } from "@/components/themed/ThemedView";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import React from "react";

import { PersonWavingIcon, PhoneIcon, ThumbsUpIcon, WebsiteIcon } from "@/components/icons/Icons";
import { RestaurantDetailItem } from "@/components/restaurant/RestaurantDetailItem";
import BannerAndAvatar from "@/components/restaurant/RestaurantBanner";
import Tag from "@/components/ui/Tag";
import { StarRating } from "@/components/ui/StarReview";
import RestaurantReviewSummary from "@/components/restaurant/RestaurantReviewSummary";
import HighlightCard from "@/components/restaurant/HighlightCard";
import FeedTabs from "@/components/Feed/FeedTabs";
import { filter } from "domutils";
import ReviewPreview from "@/components/review/ReviewPreview";
import MenuItemPreview from "@/components/Cards/MenuItemPreview";
import { useRouter } from "expo-router";

export default function RestaurantView() {
    const restaurantTags = ["Fast Food", "Fried Chicken", "Chicken Sandwiches", "Order Online"];
    const [activeTab, setActiveTab] = React.useState(0);
    const [filterTab, setFilterTab] = React.useState(0);

    const router = useRouter();

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <BannerAndAvatar bannerURL={"https://shorturl.at/zZdqT"} avatarURL={"https://shorturl.at/Yn9SH"} />
            <ThemedView style={styles.container}>
                <ThemedView style={styles.headerContainer}>
                    <ThemedText style={styles.titleText}>Popeyes</ThemedText>
                    <View style={styles.iconContainer}>
                        <PhoneIcon />
                        <WebsiteIcon />
                    </View>
                </ThemedView>

                <ThemedView style={styles.ratingContainer}>
                    <StarRating avgRating={1.9} numRatings={500} full={true} />
                </ThemedView>

                <ThemedView style={styles.detailsContainer}>
                    <RestaurantDetailItem text={"360 Huntington Ave, Boston, MA 02115"} icon={"marker"} />
                    <RestaurantDetailItem text={"Open | Closes 6 PM"} icon={"clock"} />
                </ThemedView>

                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tagsScrollViewContent}>
                    {restaurantTags.map((tag, index) => (
                        <View key={index} style={index < restaurantTags.length - 1 ? styles.tagWrapper : null}>
                            <Tag text={tag} />
                        </View>
                    ))}
                </ScrollView>

                <RestaurantReviewSummary
                    rating={4}
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
                            <TouchableOpacity onPress={() => router.push("/(review)/827b36v4b234")}>
                                <ReviewPreview
                                    plateName={"Big Whopper"}
                                    restaurantName={"Burger King"}
                                    tags={["juicy", "artificial", "fake meat"]}
                                    rating={4}
                                    content={
                                        "This is fake meat and is not good for you. Not sure why we are even serving it."
                                    }
                                />
                            </TouchableOpacity>
                        </>
                    )}

                    {filterTab == 1 && (
                        <>
                            <MenuItemPreview
                                plateName={"Whopper"}
                                restaurantName={"Burger King"}
                                tags={["juicy", "fake meat", "unhealthy"]}
                                rating={4.2}
                                content={"a juicy burger that is not meant to be consumed"}
                                picture={
                                    "https://media-cdn.grubhub.com/image/upload/d_search:browse-images:default.jpg/w_150,q_auto:low,fl_lossy,dpr_2.0,c_fill,f_auto,h_150/yzbd3ocqb3s8o2jkd2jn"
                                }
                            />
                        </>
                    )}
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
        paddingVertical: 4,
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
        fontFamily: "Outfit",
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
