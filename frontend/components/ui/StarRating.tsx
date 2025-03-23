import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StarIcon } from "@/components/icons/Icons";

export interface StarReviewProps {
    avgRating: number;
    numRatings: number;
    full?: boolean; // if true, show 5 stars, else show 1
}

interface StarProps {
    avgRating: number;
    full?: boolean;
}

export function StarRating({ avgRating, numRatings, full = true }: StarReviewProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{avgRating.toFixed(1)}</Text>
            <Stars avgRating={avgRating} full={full} />
            <Text style={styles.text}>({numRatings})</Text>
        </View>
    );
}

export function Stars({ avgRating, full = true }: StarProps) {
    const stars: React.JSX.Element[] = [];
    const maxStars = full ? 5 : 1;

    for (let i = 0; i < maxStars; i++) {
        if (i < Math.floor(avgRating)) {
            stars.push(<StarIcon key={i} width={16} height={16} filled={true} />);
        } else {
            stars.push(<StarIcon key={i} width={16} height={16} />);
        }
    }

    return <View style={styles.starsContainer}>{stars}</View>;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 4,
    },
    text: {
        fontFamily: "Outfit",
        fontWeight: "regular",
        fontSize: 16,
        letterSpacing: 0,
        textAlign: "center",
        color: "black",
    },
    starsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
    },
});

export default StarRating;
