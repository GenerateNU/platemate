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
import { SearchBoxFilter } from "@/components/SearchBoxFilter";
import type { TReview } from "@/types/review";
import { makeRequest } from "@/api/base";
import { Skeleton } from "moti/skeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
    const { user, isLoading, error, fetchUserProfile } = useUser();
    const [searchText, setSearchText] = React.useState("");
    const [userReviews, setUserReviews] = useState<TReview[] | null>(null);
    const insets = useSafeAreaInsets();

    const editProfileRef = useRef<{ open: () => void; close: () => void }>(null);
    const fetchReviews = async () => {
        if (!user) return;

        try {
            const reviewData = await makeRequest(`/api/v1/review/user/${user.id}`, "GET");
            console.log(reviewData);
            if (!reviewData) {
                throw new Error(reviewData.message || "Failed to retrieve user reviews");
            }
            setUserReviews(reviewData);
        } catch (err) {
            console.error("Failed to fetch user by ID", err);
        }
    };

    const searchReviews = async () => {
        if (!user) return;

        try {
            const reviewData = await makeRequest(`/api/v1/review/user/${user.id}/search?query=${searchText}`, "GET");
            console.log(reviewData);
            if (!reviewData) {
                throw new Error(reviewData.message || "Failed to retrieve user reviews");
            }
            setUserReviews(reviewData);
        } catch (err) {
            console.error("Failed to fetch user by ID", err);
        }
    };
    useEffect(() => {
        if (!user && !isLoading) {
            console.log("User data not available, fetching...");
            fetchUserProfile().then(() => {
                console.log("Getting the reviews");
                fetchReviews();
            });
        }
        if (!userReviews) {
            console.log("User reviews not available, fetching...");
            fetchReviews();
        }
    }, [user, isLoading]);

    if (isLoading) {
        return (
            <ThemedView style={styles.centerContainer}>
                <Skeleton show={isLoading} colorMode={"light"}>
                    <ThemedView style={{ margin: 16, width: "100%", height: "100%" }} />
                </Skeleton>
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
        <ScrollView style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
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
                <ProfileMetrics
                    numFriends={user.followingCount}
                    numReviews={userReviews?.length || 0}
                    averageRating={4.6}
                />
                <EditProfileButton text={"Edit profile"} onPress={() => router.navigate("/profile/settings")} />
                <ThemedView style={styles.reviewsContainer}>
                    <ThemedText
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            fontFamily: "Nunito",
                            marginBottom: 12,
                            lineHeight: 28,
                        }}>
                        {user.name.split(" ")[0]}'s Food Journal
                    </ThemedText>

                    <SearchBoxFilter
                        placeholder="Search my reviews"
                        name={user.username}
                        recent={false}
                        onSubmit={searchReviews}
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
                    <ThemedView style={{ gap: 12, marginTop: 12 }}>
                        {userReviews &&
                            userReviews.map((review) => (
                                <ReviewPreview
                                    reviewId={review._id}
                                    key={review._id}
                                    likes={review.likes}
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
        paddingTop: Dimensions.get("screen").height * 0.001,
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
