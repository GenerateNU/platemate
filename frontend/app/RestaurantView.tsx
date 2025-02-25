import { ThemedView } from "@/components/ThemedView";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { RestaurantTags } from "@/components/RestaurantTags";
import { StarReview } from "@/components/StarReview";
import { MenuItemCard } from "@/components/MenuItemCard";
import React from "react";

import WebsiteIcon from "@/assets/icons/website.svg";
import PhoneIcon from "@/assets/icons/phone.svg";
import MarkerIcon from "@/assets/icons/marker.svg";
import ClockIcon from "@/assets/icons/clock.svg";

import { RestaurantDetailItem } from "@/components/RestaurantDetailItem";

export default function RestaurantView() {
    const restaurantTags = ["Italian", "Vegan", "Family-friendly", "Gluten-free"]; // Example tags

    return (
        <>
            <View style={styles.bannerContainer}>
                <Image
                    source={{
                        uri: "https://png.pngtree.com/thumb_back/fw800/background/20240724/pngtree-thai-stir-fried-noodles-with-shrimps-and-egg-wrap-pad-thai-image_15912377.jpg",
                    }}
                    style={styles.bannerImage}
                />
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: "https://media-cdn.tripadvisor.com/media/photo-p/12/4c/95/45/logo.jpg" }}
                        style={styles.avatar}
                    />
                </View>
            </View>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.headerContainer}>
                    <ThemedText style={styles.titleText}>Pad Thai Kitchen</ThemedText>
                    <View style={styles.iconContainer}>
                        <PhoneIcon />
                        <WebsiteIcon />
                    </View>
                </ThemedView>

                <ThemedView style={styles.ratingContainer}>
                    <StarReview avgRating={1.9} numRatings={500} full={true} />
                </ThemedView>

                <ThemedView style={styles.detailsContainer}>
                    <RestaurantDetailItem text={"6 Hemenway St, Boston, MA 02115"} Icon={MarkerIcon} />
                    <RestaurantDetailItem text={"Open | Closes 1AM"} Icon={ClockIcon} />
                </ThemedView>

                <ThemedView style={styles.tagsContainer}>
                    <RestaurantTags tags={restaurantTags} />
                </ThemedView>

                <ThemedView style={styles.chefsPickContainer}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <ThemedView style={{ flexDirection: "row", gap: 8, paddingVertical: 4 }}>
                            <MenuItemCard
                                name="Pad Thai"
                                image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg"
                                starReview={{ avgRating: 3.5, numRatings: 100, full: false }}
                            />
                            <MenuItemCard
                                name="Pad Thai"
                                image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg"
                                starReview={{ avgRating: 3.5, numRatings: 100, full: false }}
                            />
                            <MenuItemCard
                                name="Pad Thai"
                                image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg"
                                starReview={{ avgRating: 3.5, numRatings: 100, full: false }}
                            />
                            <MenuItemCard
                                name="Pad Thai"
                                image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg"
                                starReview={{ avgRating: 3.5, numRatings: 100, full: false }}
                            />
                            <MenuItemCard
                                name="Pad Thai"
                                image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg"
                                starReview={{ avgRating: 3.5, numRatings: 100, full: false }}
                            />
                        </ThemedView>
                    </ScrollView>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <ThemedView style={{ flexDirection: "row", gap: 8, paddingVertical: 4 }}>
                            <MenuItemCard
                                name="Pad Thai"
                                image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg"
                                starReview={{ avgRating: 3.5, numRatings: 100, full: false }}
                            />
                            <MenuItemCard
                                name="Pad Thai"
                                image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg"
                                starReview={{ avgRating: 3.5, numRatings: 100, full: false }}
                            />
                            <MenuItemCard
                                name="Pad Thai"
                                image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg"
                                starReview={{ avgRating: 3.5, numRatings: 100, full: false }}
                            />
                            <MenuItemCard
                                name="Pad Thai"
                                image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg"
                                starReview={{ avgRating: 3.5, numRatings: 100, full: false }}
                            />
                            <MenuItemCard
                                name="Pad Thai"
                                image="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg"
                                starReview={{ avgRating: 3.5, numRatings: 100, full: false }}
                            />
                        </ThemedView>
                    </ScrollView>
                </ThemedView>
            </ThemedView>
        </>
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
    bannerImage: {
        width: "100%",
        height: 190,
    },
    avatarContainer: {
        position: "absolute",
        bottom: -50,
        left: 20,
        zIndex: 1,
    },
    avatar: {
        width: 144,
        height: 144,
        borderRadius: 72,
        borderWidth: 3,
        borderColor: "white",
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
