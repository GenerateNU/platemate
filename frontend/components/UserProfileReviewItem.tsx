import type React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface FoodReviewCardProps {
    userName: string;
    userHandle: string;
    plateName: string;
    restaurantName: string;
    rating: number;
    tags: string[];
    description: string;
    likes: number;
    onLike?: () => void;
    onDislike?: () => void;
    onReadMore?: () => void;
    onMoreOptions?: () => void;
}

const FoodReviewCard: React.FC<FoodReviewCardProps> = ({
    userName,
    userHandle,
    plateName,
    restaurantName,
    rating,
    tags,
    description,
    likes,
    onLike,
    onDislike,
    onReadMore,
    onMoreOptions,
}) => {
    return (
        <View style={styles.card}>
            {/* Yellow circle decoration */}
            <View style={styles.decorationCircle} />

            {/* User info */}
            <View style={styles.userInfoContainer}>
                <View>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userHandle}>@{userHandle}</Text>
                </View>
            </View>

            {/* Plate info */}
            <View style={styles.plateInfoContainer}>
                <View>
                    <Text style={styles.plateLabel}>Plate Name</Text>
                    <Text style={styles.plateName}>{plateName}</Text>
                </View>
                <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>{rating}</Text>
                    <Feather name="star" size={16} color="#FFD700" />
                </View>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                    <View
                        key={index}
                        style={[
                            styles.tag,
                            tag.toLowerCase() === "vegan" && styles.veganTag,
                            tag.toLowerCase() === "healthy" && styles.healthyTag,
                            tag.toLowerCase() === "green" && styles.greenTag,
                            tag.toLowerCase() === "low-cal" && styles.lowCalTag,
                        ]}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>

            {/* Description */}
            <Text style={styles.description} numberOfLines={3}>
                {description}
            </Text>

            {/* Read more */}
            <TouchableOpacity onPress={onReadMore}>
                <Text style={styles.readMore}>Read more</Text>
            </TouchableOpacity>

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <View style={styles.likeContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={onLike}>
                        <Feather name="thumbs-up" size={18} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.likeCount}>{likes}</Text>
                    <TouchableOpacity style={styles.actionButton} onPress={onDislike}>
                        <Feather name="thumbs-down" size={18} color="#000" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={onMoreOptions}>
                    <Feather name="more-vertical" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        position: "relative",
        overflow: "hidden",
    },
    decorationCircle: {
        position: "absolute",
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#FFF0A0",
        zIndex: 0,
    },
    userInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        zIndex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    userHandle: {
        fontSize: 14,
        color: "#666",
    },
    plateInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        zIndex: 1,
    },
    plateLabel: {
        fontSize: 14,
        fontWeight: "bold",
    },
    plateName: {
        fontSize: 16,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 4,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 12,
        zIndex: 1,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    veganTag: {
        backgroundColor: "#FFF0A0",
    },
    healthyTag: {
        backgroundColor: "#E8F5E9",
    },
    greenTag: {
        backgroundColor: "#DCEDC8",
    },
    lowCalTag: {
        backgroundColor: "#E0F7FA",
    },
    tagText: {
        fontSize: 12,
        fontWeight: "500",
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: "#333",
        marginBottom: 8,
        zIndex: 1,
    },
    readMore: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 1,
    },
    likeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButton: {
        padding: 8,
    },
    likeCount: {
        marginHorizontal: 8,
        fontSize: 14,
        fontWeight: "500",
    },
});

export default FoodReviewCard;
