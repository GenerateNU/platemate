import React from "react";
import { StyleSheet, Image } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link } from "expo-router";

export default function Playground() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
            headerImage={
                <Image
                    source={{
                        uri: "https://bookstore.gpo.gov/sites/default/files/styles/product_page_image/public/covers/600x96-official_presidential_portrait_of_barack_obama_20x24.jpg?itok=IompvPfM",
                    }}
                />
            }>
            <Link
                href={"/Dev1"}
                style={{
                    color: "#fff",
                    fontSize: 24,
                    fontWeight: "bold",
                    fontFamily: "Outfit",
                }}>
                <ThemedText type="subtitle">Development Environment 1</ThemedText>
            </Link>
            <Link
                href={"/RestaurantView"}
                style={{
                    color: "#fff",
                    fontSize: 24,
                    fontWeight: "bold",
                    fontFamily: "Outfit",
                }}>
                <ThemedText type="subtitle">Restaurant View</ThemedText>
            </Link>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: "#808080",
        bottom: -90,
        left: -35,
        position: "absolute",
    },
    titleContainer: {
        flexDirection: "row",
        gap: 8,
    },
});
