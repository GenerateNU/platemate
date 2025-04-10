import React, { useEffect, useRef, useState } from "react";
import { DEFAULT_PROFILE_PIC, useUser } from "@/context/user-context";
import { ThemedView } from "@/components/themed/ThemedView";
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileIdentity from "@/components/profile/ProfileIdentity";
import ProfileMetrics from "@/components/profile/ProfileMetrics";
import { EditProfileButton } from "@/components/profile/EditProfileButton";
import { router } from "expo-router";
import EditProfileSheet from "@/components/profile/EditProfileSheet";
import ReviewPreview from "@/components/review/ReviewPreview";
import { SearchBox } from "@/components/SearchBox";
import type { TReview } from "@/types/review";
import { makeRequest } from "@/api/base";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
    const { user, isLoading, error, fetchUserProfile } = useUser();
    const [searchText, setSearchText] = React.useState("");
    const [userReviews, setUserReviews] = useState<TReview[]>([]);

    const editProfileRef = useRef<{ open: () => void; close: () => void }>(null);

    useEffect(() => {
        if (!user && !isLoading) {
            console.log("User data not available, fetching...");
            fetchUserProfile().then(() => {});
        }
        const fetchReviews = async () => {
            if (!user?.id) return;

            try {
                const reviewData = await makeRequest(`/api/v1/review/user/${user.id}`, "GET");
                if (!reviewData) {
                    throw new Error(reviewData.message || "Failed to retrieve user reviews");
                }
                setUserReviews(reviewData);
            } catch (err) {
                console.error("Failed to fetch user by ID", err);
            }
        };
        fetchReviews();
    }, [user, isLoading]);

    if (isLoading) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#ffcf0f" />
                <ThemedText style={{ marginTop: 10 }}>Loading profile...</ThemedText>
            </ThemedView>
        );
    }

    if (!user || error) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ThemedText>An error occurred.</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient
                colors={["white", "#FFFCE4"]}
                style={styles.topOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
            <TouchableOpacity style={styles.hamburgerButton} onPress={() => editProfileRef.current?.open()}>
                <Ionicons name="menu" size={28} color="#333" />
            </TouchableOpacity>
            <ScrollView style={styles.container}>
                <ProfileAvatar url={user.profile_picture || DEFAULT_PROFILE_PIC} />
                <ProfileIdentity name={user.name} username={user.username} />
                <ProfileMetrics numFriends={user.followingCount} numReviews={100} averageRating={4.6} />
                <EditProfileButton text={"Edit profile"} onPress={() => router.navigate("/profile/settings")} />
                <ThemedView style={styles.reviewsContainer}>
                    <ThemedText
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            fontFamily: "Source Sans 3",
                            marginBottom: 12,
                            lineHeight: 28,
                        }}>
                        {user.name.split(" ")[0]}'s Food Journal
                    </ThemedText>

                    <SearchBox
                        placeholder="Search my reviews"
                        name={user.username}
                        recent={false}
                        onSubmit={() => console.log("submit")}
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
                    {userReviews.map((review) => (
                        <ReviewPreview
                            key={review._id}
                            plateName={review.menuItemName}
                            restaurantName={review.restaurantName}
                            tags={[]}
                            rating={review.rating.overall}
                            content={review.content}
                            authorId={user.id}
                            authorName={user.name}
                            authorUsername={user.username}
                            authorAvatar={user.profile_picture || DEFAULT_PROFILE_PIC}
                        />
                    ))}
                </ThemedView>
            </ScrollView>
            <EditProfileSheet user={user} ref={editProfileRef} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    hamburgerButton: {
        position: "absolute",
        top: 10,
        right: 20,
        zIndex: 10,
        borderRadius: 20,
        padding: 8,
        elevation: 5,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "transparent",
        paddingTop: Dimensions.get("screen").height * 0.025,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    reviewsContainer: {
        marginVertical: 24,
    },
    topOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 260,
        borderBottomLeftRadius: width / 2.5,
        borderBottomRightRadius: width / 2.5,
        zIndex: 0,
    },
});

export default ProfileScreen;
