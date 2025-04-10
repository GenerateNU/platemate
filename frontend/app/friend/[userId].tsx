import React, { useEffect, useRef, useState } from "react";
import { ThemedView } from "@/components/themed/ThemedView";
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileIdentity from "@/components/profile/ProfileIdentity";
import ProfileMetrics from "@/components/profile/ProfileMetrics";
import ReviewPreview from "@/components/review/ReviewPreview";
import { SearchBoxFilter } from "@/components/SearchBoxFilter";
import { FollowButton } from "@/components/profile/followers/FollowButton";
import { useLocalSearchParams } from "expo-router";
import type { User } from "@/context/user-context";
import { DEFAULT_PROFILE_PIC } from "@/context/user-context";
import type { TReview } from "@/types/review";
import { makeRequest } from "@/api/base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Skeleton } from "moti/skeleton";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
    console.log("hi");
    const { userId } = useLocalSearchParams();
    console.log(userId);
    const [searchText, setSearchText] = useState("");
    const editFriend = useRef<{ open: () => void; close: () => void }>(null);
    const insets = useSafeAreaInsets();

    const [user, setUser] = useState<User>({
        id: "",
        email: "",
        name: "",
        profile_picture: "",
        username: "",
        followersCount: 0,
        followingCount: 0,
        preferences: [],
    }); //initialziing the user to an empty user
    const [userReviews, setUserReviews] = useState<TReview[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndReviews = async () => {
            if (!userId) return;

            setLoading(true);
            try {
                const userData = await makeRequest(`/api/v1/user/${userId}`, "GET");
                if (!userData) {
                    throw new Error(userData.message || "failed to retrieve ther user");
                }
                const newUser: User = {
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    profile_picture: userData.profile_picture,
                    username: userData.username,
                    followersCount: userData.followersCount,
                    followingCount: userData.followingCount,
                    preferences: userData.preferences,
                };
                setUser(newUser);

                const reviewData = await makeRequest(`/api/v1/review/user/${userId}`, "GET");
                if (!reviewData) {
                    throw new Error(reviewData.message || "failed to retrieve user reviews");
                }
                console.log(reviewData);
                setUserReviews(reviewData);
            } catch (err) {
                console.error("Failed to fetch user by ID", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndReviews();
    }, [userId]);

    if (isLoading) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <ThemedText style={{ marginTop: 10 }}>Loading profile...</ThemedText>
            </ThemedView>
        );
    }
    // for now!!!
    // if (!user || error) {
    //     return (
    //         <ThemedView style={styles.centerContainer}>
    //             <ThemedText>An error occurred.</ThemedText>
    //         </ThemedView>
    //     );
    // }

    console.log(user);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
            <ThemedView>
                <StatusBar barStyle="dark-content" />
                <LinearGradient
                    colors={["white", "#FFFCE4"]}
                    style={styles.topOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />
                <TouchableOpacity
                    onPress={() => {
                        console.log("Button Pressed!");
                    }}>
                    <Ionicons name="ellipsis-horizontal" size={30} color="#333" style={{ left: 24 }} />
                </TouchableOpacity>
                <ScrollView style={styles.container}>
                    {/* inserted a default profile picture because profile_picture is string | undefined */}
                    <ProfileAvatar url={user.profile_picture || DEFAULT_PROFILE_PIC} />
                    <ProfileIdentity name={user.name} username={user.username || "not-displayed"} />
                    <ProfileMetrics
                        numFriends={user.followingCount}
                        numReviews={userReviews.length || 0}
                        averageRating={4.6}
                    />
                    <FollowButton text={"Friends"} />
                    <ThemedView style={styles.reviewsContainer}>
                        <ThemedText
                            style={{
                                fontSize: 24,
                                fontWeight: "bold",
                                fontFamily: "Nunito",
                                marginBottom: 8,
                                lineHeight: 32,
                            }}>
                            {user.name}'s Food Journal
                        </ThemedText>
                        {/* Made a search box with a filter/sort component as its own component */}
                        <SearchBoxFilter
                            placeholder={`Search ${user.name}'s Reviews`}
                            recent={true}
                            onSubmit={() => console.log("submit")}
                            value={searchText}
                            onChangeText={(text) => setSearchText(text)}
                        />
                        <ThemedView style={{ gap: 12, marginTop: 12 }}>
                            {userReviews.map((review) => (
                                <ReviewPreview
                                    reviewId={review._id}
                                    likes={review.likes}
                                    key={review._id}
                                    plateName={review.menuItemName}
                                    restaurantName={review.restaurantName}
                                    tags={[]}
                                    rating={review.rating.overall}
                                    content={review.content}
                                    authorName={user.name}
                                    authorUsername={user.username || "not-displayed"}
                                    authorAvatar={user.profile_picture || DEFAULT_PROFILE_PIC}
                                    authorId={user.id}></ReviewPreview>
                            ))}
                        </ThemedView>
                    </ThemedView>
                </ScrollView>
            </ThemedView>
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
        paddingHorizontal: 24,
        backgroundColor: "transparent",
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
