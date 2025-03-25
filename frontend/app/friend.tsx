import React, { useEffect, useRef } from "react";
import { useUser } from "@/context/user-context";
import { ThemedView } from "@/components/ThemedView";
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileIdentity from "@/components/profile/ProfileIdentity";
import ProfileMetrics from "@/components/profile/ProfileMetrics";
import EditProfileSheet from "@/components/profile/EditProfileSheet";
import ReviewPreview from "@/components/Cards/ReviewPreview";
import { SearchBox } from "@/components/SearchBox";
import Vector from "@/assets/icons/Vector.svg";

import { FollowButton } from "@/components/profile/followers/FollowButton";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
    const { user, isLoading, error, fetchUserProfile } = useUser();
    const [searchText, setSearchText] = React.useState("");

    const editProfileRef = useRef<{ open: () => void; close: () => void }>(null);

    useEffect(() => {
        if (!user && !isLoading) {
            console.log("User data not available, fetching...");
            fetchUserProfile().then(() => { });
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
            <TouchableOpacity style={styles.hamburgerButton} onPress={() => editProfileRef.current?.open()}>
                {/* TODO: ADD BLOCK USER REPORT USER ETC */}
                <Ionicons name="ellipsis-horizontal" size={30} color="#333" />
            </TouchableOpacity>
            <ScrollView style={styles.container}>
                <ProfileAvatar url={user.profile_picture || "https://shorturl.at/Dhcvo"} />
                <ProfileIdentity name={"Ben Petrillo"} username={"benpetrillo26"} />
                <ProfileMetrics numFriends={100} numReviews={100} averageRating={4.6} />
                {/* this component can be extracted out into just a button */}
                <FollowButton text={"Following"} /> 
                <ThemedView style={styles.reviewsContainer}>
                    <ThemedText style={{ fontSize: 24, fontWeight: "bold", fontFamily: "Source Sans 3", marginBottom: 16 }}>
                        My Reviews
                    </ThemedText>
                    {/* <ThemedText style={styles.searchContainer}> */}
                        <SearchBox
                            style={styles.searchBoxContainer}
                            placeholder="Search Ben's reviews"
                            recent={true}
                            name="general"
                            onSubmit={() => console.log("submit")}
                            value={searchText}
                            onChangeText={(text) => setSearchText(text)}
                        />
                        <Vector style={styles.vector} />
                    {/* </ThemedText> */}
                    <ReviewPreview plateName="Ceasar Salad" restaurantName="Luigi's" tags={["Vegan", "Green", "Healthy", "Low Cal"]} rating={4.5} content={"It was pretty good."}>
                    </ReviewPreview>

                </ThemedView>
            </ScrollView>
            <EditProfileSheet user={user} ref={editProfileRef} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    hamburgerButton: {
        position: "absolute", // This will allow you to position the button outside the normal flow
        right: 10,
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
        flexDirection: "row",  // Makes SearchBox and Vector sit next to each other
        alignItems: "center",
        width: "100%",         // Ensures full width
        paddingHorizontal: 12,
        gap: 12,
    },
    searchBoxContainer: {
        flex: 1,               // Allows it to take most of the space
    },
    vector: {
        width: 24,             // Adjust as needed
        height: 24,
        marginLeft: 1000,        // Ensures proper spacing from search bar
    },

});


export default ProfileScreen;
