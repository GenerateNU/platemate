import { ThemedView } from "@/components/ThemedView";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { FilterTags } from "@/components/RestaurantTags";
import { StarReview } from "@/components/StarReview";
import React from "react";

import { PhoneIcon, WebsiteIcon } from "@/components/icons/Icons";
import { RestaurantDetailItem } from "@/components/restaurant/RestaurantDetailItem";
import BannerAndAvatar from "@/components/restaurant/RestaurantBanner";

export default function RestaurantView() {
    const restaurantTags = ["Fast Food", "Fried Chicken", "Chicken Sandwiches", "Order Online"];

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
                    <StarReview avgRating={1.9} numRatings={500} full={true} />
                </ThemedView>

                <ThemedView style={styles.detailsContainer}>
                    <RestaurantDetailItem text={"360 Huntington Ave, Boston, MA 02115"} icon={"marker"} />
                    <RestaurantDetailItem text={"Open | Closes 6 PM"} icon={"clock"} />
                </ThemedView>

                <ThemedView style={styles.tagsContainer}>
                    <FilterTags tags={restaurantTags} />
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
    tagsContainer: {
        paddingVertical: 8,
        gap: 4,
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
});
