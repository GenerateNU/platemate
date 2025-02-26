import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ShadedStar from "@/assets/icons/shaded_star_rate.svg";
import UnshadedStar from "@/assets/icons/unshaded_star_rate.svg";
import { StyleSheet } from "react-native";

export interface StarReviewProps {
    avgRating: number;
    numRatings: number;
    full?: boolean; // If true, show 5 stars, else show 1
}

export interface InteractiveStarsProps {
    rating: number;
    onChange: (value: number) => void;
    starSize?: number;
}

interface StarProps {
    avgRating: number;
    full?: boolean;
}

export function StarReview({ avgRating, numRatings, full = true }: StarReviewProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{avgRating.toFixed(1)}</Text>
            <Stars avgRating={avgRating} full={full} />
            <Text style={styles.text}>({numRatings})</Text>
        </View>
    );
}

export function Stars({ avgRating, full = true }: StarProps) {
    const stars = [];
    const maxStars = full ? 5 : 1;
    if (full) {
        for (let i = 0; i < maxStars; i++) {
            if (i < Math.floor(avgRating)) {
            } else {
                stars.push(<UnshadedStar key={i} width={16} height={16} />);
            }
        }
    } else {
        stars.push(<UnshadedStar key={0} width={16} height={16} />);
    }

    return <View style={styles.starsContainer}>{stars}</View>;
}

export function InteractiveStars({ rating, onChange, starSize = 24 }: InteractiveStarsProps) {
    const maxStars = 5;
    return (
        <View style={styles.starRow}>
            {Array.from({ length: maxStars }).map((_, i) => {
                const isFilled = i < rating;
                const StarIcon = isFilled ? ShadedStar : UnshadedStar;
                return (
                    <TouchableOpacity key={i} onPress={() => onChange(i + 1)}>
                        <StarIcon width={starSize} height={starSize} />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 7,
    },
    text: {
        fontFamily: "Outfit",
        fontWeight: "500",
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 0,
        textAlign: "center",
        color: "#285852",
    },
    starsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
    },
    starRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
