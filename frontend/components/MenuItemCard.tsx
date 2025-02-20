import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { StarReview } from "@/components/StarReview";
import { StarReviewProps } from "@/components/StarReview";
import { Image } from "react-native";

interface MenuItemCardsProp {
    tags: string[];
}

interface MenuItemProp {
    name: string;
    image: string;
    starReview: StarReviewProps;
}

export function MenuItemCard({ name, image, starReview }: MenuItemProp) {
    return (
        <View style={styles.container}>
            {/* Image Section (Top 2/3) */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
            </View>

            {/* Bottom Section (1/3) */}
            <View style={styles.nameReviewsContainer}>
                {/* Title (Centered) */}
                <View style={styles.titleRow}>
                    <Text style={styles.text}>{name}</Text>
                </View>

                {/* Stars (Bottom-Right) */}
                <View style={styles.starRow}>
                    <StarReview {...starReview} />
                </View>
            </View>
        </View>
    );


}



const styles = StyleSheet.create({
    text: {
        fontFamily: "Outfit",
        fontWeight: "700",
        fontSize: 14,
        lineHeight: 28,
        letterSpacing: 0,
        textAlign: "center",
        color: "#000000",
    },
    nameReviewsContainer: {
        flex: 1, // Takes 1/3 of the space
        flexDirection: "column",

    },
    titleRow: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    starRow: {
        flex: 1, // Takes 1/2 of bottom section
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: 4
    },
    container: {
        width: 144,
        height: 164,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#285852",
        borderRadius: 15,
        overflow: "hidden",
    },
    imageContainer: {
        flex: 2, // Takes 2/3 of the space
        width: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    }
 });
