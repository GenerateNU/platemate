import { Button, Image, StyleSheet, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { RestaurantTags } from "@/components/RestaurantTags";
import { StarReview } from "@/components/StarReview";
import { Link } from "expo-router";
import React from "react";

export default function HomeScreen() {
    const restaurantTags = ["Italian", "Vegan", "Family-friendly", "Gluten-free"]; // Example tags

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            headerImage={<Image source={require("@/assets/images/partial-react-logo.png")} style={styles.reactLogo} />}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type={"title"} style={{ fontFamily: "Outfit" }}>
                    PlateMate - React Native Boilerplate
                </ThemedText>
            </ThemedView>
            <ThemedView>
                <ThemedText type={"default"} style={{ fontFamily: "Outfit" }}>
                    This page serves as the landing page of the app. This code is boilerplate code made to give you a
                    brief overview of best practices for React Native development.
                </ThemedText>
            </ThemedView>
            <ThemedView>
                <Link href={"/feed"}>
                    <ThemedText type={"default"} lightColor={"#20c1e6"} style={{ fontFamily: "Outfit" }}>
                        Click here to view an example stack.
                    </ThemedText>
                </Link>
            </ThemedView>
            <ThemedView>
                <RestaurantTags tags={restaurantTags} />
            </ThemedView>
            <ThemedView>
                <StarReview avgRating={4.5} numRatings={123} full={true} />
            </ThemedView>


        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
