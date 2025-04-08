import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ShadedStar from "@/assets/icons/shaded_star_rate.svg";
import UnshadedStar from "@/assets/icons/unshaded_star_rate.svg";
import { StyleSheet } from "react-native";
import { StarIcon } from "@/components/icons/Icons";

export interface StarReviewProps {
    avgRating: number;
    numRatings: number;
    full?: boolean; // If true, show 5 stars, else show 1
    showAvgRating?: boolean; // Controls display of the average rating number
    showNumRatings?: boolean; // Controls display of the number of ratings
    showNumRatingsText?: boolean; // Controls display of "reviews" text
}

export interface InteractiveStarsProps {
    rating: number;
    onChange: (value: number) => void;
    starSize?: number;
    activeColor?: string; // color when a star is filled
    inactiveColor?: string; // color when a star is not filled
}

interface StarProps {
    avgRating: number;
    full?: boolean;
}

export function StarRating({
    avgRating,
    numRatings,
    full = true,
    showAvgRating = true,
    showNumRatings = true,
    showNumRatingsText = true,
}: StarReviewProps) {
    return (
        <View style={styles.container}>
            {avgRating > 0 && showAvgRating && <Text style={styles.text}>{avgRating.toFixed(1)}</Text>}
            {avgRating > 0 && <Stars avgRating={avgRating} full={full} />}
            {numRatings > 0 && showNumRatings && (
                <Text style={styles.text}>
                    ({numRatings}
                    {showNumRatingsText ? " reviews" : ""})
                </Text>
            )}
        </View>
    );
}

export function Stars({ avgRating, full = true }: StarProps) {
    const STAR_SIZE = 24;
    const stars: React.JSX.Element[] = [];
    const maxStars = full ? 5 : 1;
    if (full) {
        for (let i = 0; i < maxStars; i++) {
            if (i < Math.floor(avgRating)) {
                stars.push(<StarIcon key={i} width={STAR_SIZE} height={STAR_SIZE} filled={true} />);
            } else {
                stars.push(<StarIcon key={i} width={STAR_SIZE} height={STAR_SIZE} filled={true} />);
            }
        }
    } else {
        stars.push(<StarIcon key={0} width={STAR_SIZE} height={STAR_SIZE} filled={false} />);
    }

    return <View style={styles.starsContainer}>{stars}</View>;
}

export function InteractiveStars({
    rating,
    onChange,
    starSize = 24,
    activeColor = "#F7B418", // default yellow for interactive instance
    inactiveColor = "#FFFFFF", // default white for interactive instance
}: InteractiveStarsProps) {
    const maxStars = 5;
    return (
        <View style={styles.starRow}>
            {Array.from({ length: maxStars }).map((_, i) => {
                const isFilled = i < rating;
                const StarShaded = isFilled ? ShadedStar : UnshadedStar;
                return (
                    <TouchableOpacity key={i} onPress={() => onChange(i + 1)}>
                        <StarIcon
                            width={starSize}
                            height={starSize}
                            fill={isFilled ? activeColor : inactiveColor}
                            filled={isFilled}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        // alignItems: "center", // Ensures vertical alignment
        // justifyContent: "center", // Centers items horizontally
        gap: 7,
    },
    text: {
        fontFamily: "Source Sans 3",
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
        gap: 3,
        marginTop: -4,
    },
    starRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
