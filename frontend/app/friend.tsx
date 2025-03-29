import React, { useEffect, useRef } from "react";
import { useUser } from "@/context/user-context";
import { ThemedView } from "@/components/themed/ThemedView";
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileIdentity from "@/components/profile/ProfileIdentity";
import ProfileMetrics from "@/components/profile/ProfileMetrics";
import EditProfileSheet from "@/components/profile/EditProfileSheet";
import ReviewPreview from "@/components/review/ReviewPreview";
import { SearchBoxFilter } from "@/components/SearchBoxFilter";
import EditFriendSheet from "@/components/profile/followers/FriendProfileOptions";
import { FollowButton } from "@/components/profile/followers/FollowButton";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
    const { user, isLoading, error, fetchUserProfile } = useUser();
    const [searchText, setSearchText] = React.useState("");

    const editFriend = useRef<{ open: () => void; close: () => void }>(null);

    useEffect(() => {
        if (!user && !isLoading) {
            console.log("User data not available, fetching...");
            fetchUserProfile().then(() => {});
        }
    }, [user, isLoading]);

    if (isLoading) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
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
            <TouchableOpacity
                style={styles.ellipseButton}
                onPress={() => {
                    console.log("Button Pressed!");
                    console.log("editFriend Ref:", editFriend.current);
                    editFriend.current?.open();
                }}>
                <Ionicons name="ellipsis-horizontal" size={30} color="#333" />
            </TouchableOpacity>
            <ScrollView style={styles.container}>
                <ProfileAvatar url={user.profile_picture || "https://shorturl.at/Dhcvo"} />
                <ProfileIdentity name={"Ben Petrillo"} username={"benpetrillo26"} />
                <ProfileMetrics numFriends={100} numReviews={100} averageRating={4.6} />
                <FollowButton text={"Following"} />
                <ThemedView style={styles.reviewsContainer}>
                    <ThemedText
                        style={{ fontSize: 24, fontWeight: "bold", fontFamily: "Source Sans 3", marginBottom: 16 }}>
                        Ben's Food Journal
                    </ThemedText>
                    <SearchBoxFilter
                        style={styles.searchBoxContainer}
                        placeholder="Search Ben's reviews"
                        recent={true}
                        onSubmit={() => console.log("submit")}
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
                    <ReviewPreview
                        plateName="Ceasar Salad"
                        restaurantName="Luigi's"
                        tags={["Vegan", "Green", "Healthy", "Low Cal"]}
                        rating={4.5}
                        content={"It was pretty good."}></ReviewPreview>
                </ThemedView>
            </ScrollView>
            <EditFriendSheet user={user} ref={editFriend} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    ellipseButton: {
        position: "absolute",
        right: 10,
        zIndex: 100, // Had to put this to make it clickable
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
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 12,
        gap: 12,
    },
    searchBoxContainer: {
        flex: 1,
    },
});

export default ProfileScreen;
