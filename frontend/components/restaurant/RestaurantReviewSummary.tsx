import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StarIcon } from "@/components/icons/Icons";

const ReviewSummary = ({
    rating = 4,
    maxRating = 5,
    reviewCount = 300,
    friendsReviewCount = 3,
    highlight = "Best Pad Thai in Boston. I'm serious.",
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.ratingSection}>
                <View style={styles.ratingCircle}>
                    <Text style={styles.ratingText}>{rating}</Text>
                    <Text style={styles.maxRatingText}>/{maxRating}</Text>
                </View>

                <View style={styles.starsAndCountSection}>
                    <View style={styles.starsRow}>
                        {[...Array(maxRating)].map((_, index) => (
                            <StarIcon key={index} width={18} height={18} color="#fc0" filled={index < rating} />
                        ))}
                    </View>
                    <Text style={styles.reviewCount}>{reviewCount} total reviews</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.highlightSection}>
                <Text style={styles.highlightText}>"{highlight}"</Text>
                <View style={styles.friendsContainer}>
                    <View style={styles.avatarStack}>
                        {[...Array(Math.min(friendsReviewCount, 3))].map((_, index) => (
                            <View key={index} style={[styles.friendAvatar, { right: index * 12 }]} />
                        ))}
                    </View>
                    <Text style={styles.friendsText}>
                        {friendsReviewCount} friend{friendsReviewCount !== 1 ? "s" : ""} reviewed recently
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 16,
        width: "100%",
    },
    ratingSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginRight: 16,
    },
    ratingText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222222",
        fontFamily: "Outfit",
    },
    maxRatingText: {
        fontSize: 18,
        color: "#666666",
        fontWeight: "500",
        marginTop: 2,
        fontFamily: "Outfit",
    },
    starsAndCountSection: {
        flex: 1,
    },
    starsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        gap: 4,
    },
    reviewCount: {
        fontSize: 14,
        color: "#666666",
        fontWeight: "500",
        fontFamily: "Outfit",
    },
    divider: {
        height: 1,
        backgroundColor: "#EEEEEE",
        marginVertical: 8,
    },
    highlightSection: {
        flexDirection: "column",
    },
    highlightText: {
        fontSize: 16,
        fontStyle: "italic",
        color: "#222222",
        marginBottom: 12,
        lineHeight: 22,
        fontFamily: "Outfit",
    },
    friendsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarStack: {
        height: 30,
        width: 50,
        position: "relative",
    },
    friendAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#E0E0E0",
        borderWidth: 2,
        borderColor: "#FFFFFF",
        position: "absolute",
        top: 0,
    },
    friendsText: {
        fontSize: 13,
        color: "#666666",
        marginLeft: 6,
        fontFamily: "Outfit",
    },
});

export default ReviewSummary;
