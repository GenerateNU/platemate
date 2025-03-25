import { ThemedView } from "@/components/themed/ThemedView";
import { ScrollView, StyleSheet, View, Image, Pressable } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import { StarReview } from "@/components/StarReview";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import ReviewPreview from "@/components/review/ReviewPreview";
import ReviewDetail from "@/components/review/ReviewDetail";
import { ThemedTag } from "@/components/themed/ThemedTag";
import { RestaurantTags } from "@/components/RestaurantTags";
import { StatCard } from "@/components/Cards/StatCard";

// Temporary icons - you may want to create proper icons
const FriendsIcon = () => (
    <View style={styles.statsIcon}>
        <ThemedText>👥</ThemedText>
    </View>
);

const StarsIcon = () => (
    <View style={styles.statsIcon}>
        <ThemedText>⭐</ThemedText>
    </View>
);

const SatisfactionIcon = () => (
    <View style={styles.statsIcon}>
        <ThemedText>😊</ThemedText>
    </View>
);

export default function MenuItemView() {
    const [selectedFilter, setSelectedFilter] = React.useState("My Reviews");
    const dishTags = [
        {
            title: "Gluten-free",
            backgroundColor: "#FFF3E0",
            textColor: "#EF6C00",
        },
        {
            title: "Spicy",
            backgroundColor: "#FFEBEE",
            textColor: "#C62828",
        },
        {
            title: "Healthy",
            backgroundColor: "#E8F5E9",
            textColor: "#2E7D32",
        },
    ];

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ThemedView style={styles.bannerContainer}>
                <Image source={{ uri: "https://shorturl.at/zZdqT" }} style={styles.bannerImage} />
            </ThemedView>
            <ThemedView style={styles.container}>
                {/* Header Section */}
                <ThemedView style={styles.headerContainer}>
                    <View style={styles.titleRow}>
                        <ThemedText style={styles.titleText}>Pad Thai</ThemedText>
                        <View style={styles.titleIcons}>
                            <Pressable style={styles.iconButton}>
                                <Ionicons name="share-outline" size={24} color="#666" />
                            </Pressable>
                            <Pressable style={styles.iconButton}>
                                <Ionicons name="heart-outline" size={24} color="#666" />
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.restaurantContainer}>
                        <Ionicons name="restaurant-outline" size={20} color="#666" />
                        <ThemedText style={styles.restaurantText}>Pad Thai Kitchen</ThemedText>
                    </View>
                </ThemedView>

                {/* Tags Section */}
                <ThemedView style={styles.tagsContainer}>
                    <View style={styles.tagRow}>
                        {dishTags.map((tag, index) => (
                            <ThemedTag
                                key={index}
                                title={tag.title}
                                backgroundColor={tag.backgroundColor}
                                textColor={tag.textColor}
                            />
                        ))}
                    </View>
                </ThemedView>

                {/* Description Section */}
                <ThemedView style={styles.descriptionContainer}>
                    <ThemedText style={styles.descriptionText}>
                        flavorful Thai stir-fried noodle dish with a perfect sweet-savory balance.
                    </ThemedText>
                    <View style={styles.allergyRow}>
                        <ThemedText style={styles.allergyText}>
                            Rice noodles, eggs, tofu/shrimp, peanuts, tamarind.
                        </ThemedText>
                        <Pressable>
                            <ThemedText style={styles.viewAllText}>see allergy</ThemedText>
                        </Pressable>
                    </View>
                </ThemedView>

                {/* Stats Cards Section */}
                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle}>Overall Ratings</ThemedText>
                    <Pressable>
                        <ThemedText style={styles.viewAllText}>view all</ThemedText>
                    </Pressable>
                </View>
                <View style={styles.statsContainer}>
                    <StatCard icon={<FriendsIcon />} title="Friends' Fav" subtitle="100+ Friends' refers" />
                    <StatCard icon={<StarsIcon />} title="Super Stars" subtitle="200+ Five Stars" />
                    <StatCard icon={<SatisfactionIcon />} title="Satisfaction" subtitle="70% revisited" />
                </View>

                {/* Reviews Section */}
                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle}>Reviews</ThemedText>
                    <Pressable>
                        <ThemedText style={styles.viewAllText}>view all</ThemedText>
                    </Pressable>
                </View>
                <View style={styles.reviewStats}>
                    <View style={styles.ratingContainer}>
                        <ThemedText style={styles.ratingText}>4/5</ThemedText>
                        <StarReview avgRating={4} numRatings={428} showAvgRating={false} />
                    </View>
                </View>

                {/* Review Filters */}
                <View style={styles.filterContainer}>
                    {["My Reviews", "Friends", "All"].map((filter) => (
                        <Pressable
                            key={filter}
                            style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
                            onPress={() => setSelectedFilter(filter)}>
                            <ThemedText
                                style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                                {filter}
                            </ThemedText>
                        </Pressable>
                    ))}
                </View>

                {/* Sample Review Preview */}
                <ReviewPreview
                    plateName="Pad Thai"
                    restaurantName="Pad Thai Kitchen"
                    tags={["Vegan", "Healthy", "Green", "Low-Cal"]}
                    rating={4}
                    content="The Buddha Bowl at Green Garden exceeded my expectations! Fresh ingredients, perfectly balanced flavors, and generous portions make this a must-try for health-conscious diners. The avocado was perfectly ripe, and the quinoa was cooked to perfection. I especially loved the homemade tahini dressing."
                />
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    bannerContainer: {
        width: "100%",
        height: 200,
        overflow: "hidden",
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 24,
        marginTop: -30,
        backgroundColor: "white",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleIcons: {
        flexDirection: "row",
        gap: 16,
    },
    iconButton: {
        padding: 4,
    },
    headerContainer: {
        gap: 8,
    },
    titleText: {
        fontWeight: "600",
        fontFamily: "Outfit",
        fontSize: 28,
        paddingTop: 6,
    },
    restaurantContainer: {
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    restaurantText: {
        fontSize: 18,
        color: "#666",
    },
    tagsContainer: {
        paddingVertical: 16,
        pointerEvents: "none",
    },
    descriptionContainer: {
        gap: 8,
        marginBottom: 24,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
    },
    allergyText: {
        fontSize: 14,
        color: "#666",
    },
    allergyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
    },
    viewAllText: {
        color: "#007AFF",
        textDecorationLine: "underline",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
        marginBottom: 32,
    },
    statsIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    reviewStats: {
        marginBottom: 16,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    ratingText: {
        fontSize: 24,
        fontWeight: "600",
    },
    reviewCount: {
        color: "#666",
    },
    filterContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: "#f5f5f5",
    },
    filterButtonActive: {
        backgroundColor: "#FFD700",
    },
    filterText: {
        fontSize: 14,
    },
    filterTextActive: {
        fontWeight: "600",
    },
    tagRow: {
        flexDirection: "row",
        gap: 8,
    },
});
