import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/user-context";
import { ThemedView } from "@/components/themed/ThemedView";
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileIdentity from "@/components/profile/ProfileIdentity";
import ProfileMetrics from "@/components/profile/ProfileMetrics";
<<<<<<<< HEAD:frontend/app/(profile)/[id].tsx
import { EditProfileButton } from "@/components/profile/EditProfileButton";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import EditProfileSheet from "@/components/profile/EditProfileSheet";
import ReviewPreview from "@/components/review/ReviewPreview";
import { SearchBoxFilter } from "@/components/SearchBoxFilter";

const { width } = Dimensions.get("window");

const user = {
    username: "lrollo02",
    name: "Danny Rollo",
    reviews: 12,
    friends: 19,
    averageRating: 4.2,
    profilePicture: "https://randomuser.me/api/portraits/men/44.jpg",
};

const ProfileScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const [searchText, setSearchText] = React.useState("");
========
import ReviewPreview from "@/components/review/ReviewPreview";
import { SearchBoxFilter } from "@/components/SearchBoxFilter";
import EditFriendSheet from "@/components/profile/followers/FriendProfileOptions";
import { FollowButton } from "@/components/profile/followers/FollowButton";
import { useLocalSearchParams } from 'expo-router';
import type { User } from '@/context/user-context';
import type { Review } from '@/types/review';

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
    console.log("hi");
    const {userId} = useLocalSearchParams();
    console.log(userId);
    const [searchText, setSearchText] = useState("");
    const editFriend = useRef<{ open: () => void; close: () => void }>(null);
  
    const [user, setUser] = useState<User>({
        id: "",
        email: "",
        name: "",
        profile_picture: "",
        username: "",
        followersCount: 0,
        followingCount: 0,
        preferences: []
      }); //initialziing the user to an empty user
    const [userReviews, setUserReviews] = useState<Review[]>([]);
    const [isLoading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUserAndReviews = async () => {
        if (!userId) return ;
  
        setLoading(true);
        try {
          const userRes = await fetch(
                `https://externally-exotic-orca.ngrok-free.app/api/v1/user/${userId}`);
          const userData = await userRes.json();
          console.log(userData);
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

          const reviewsRes = await fetch(
            `https://externally-exotic-orca.ngrok-free.app/api/v1/review/user/${userId}`);
          const reviewData = await reviewsRes.json();
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
>>>>>>>> featurethon-user-profile:frontend/app/friend/[userId].tsx

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient
                colors={["white", "#FFFCE4"]}
                style={styles.topOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
<<<<<<<< HEAD:frontend/app/(profile)/[id].tsx
            <ScrollView style={styles.container}>
                <ProfileAvatar url={user.profilePicture || "https://shorturl.at/Dhcvo"} />
                <ProfileIdentity name={user.name} username={user.username} />
                <ProfileMetrics numFriends={100} numReviews={100} averageRating={4.6} />
                <EditProfileButton
                    text={"Edit profile"}
                    onPress={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                />
                <ThemedView style={styles.reviewsContainer}>
                    <ThemedText
                        style={{ fontSize: 24, fontWeight: "bold", fontFamily: "Source Sans 3", marginBottom: 16 }}>
                        {user.name.split(" ")[0]}'s Food Journal
========
            <TouchableOpacity
                style={styles.ellipseButton}
                onPress={() => {
                    console.log("Button Pressed!");
                }}>
                <Ionicons name="ellipsis-horizontal" size={30} color="#333" />
            </TouchableOpacity>
            <ScrollView style={styles.container}>
                {/* inserted a default profile picture because profile_picture is string | undefined */}
                <ProfileAvatar url={user.profile_picture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} /> 
                <ProfileIdentity name={user.name} username={user.username} />
                <ProfileMetrics numFriends={user.followingCount} numReviews={100} averageRating={4.6} />
                <FollowButton text={"Friends"} />
                <ThemedView style={styles.reviewsContainer}>
                    <ThemedText
                        style={{ fontSize: 24, fontWeight: "bold", fontFamily: "Source Sans 3", marginBottom: 16 }}>
                        {user.name}'s Food Journal
>>>>>>>> featurethon-user-profile:frontend/app/friend/[userId].tsx
                    </ThemedText>
                    {/* Made a search box with a filter/sort component as its own component */}
                    <SearchBoxFilter
<<<<<<<< HEAD:frontend/app/(profile)/[id].tsx
                        placeholder="Search my reviews"
========
                        style={styles.searchBoxContainer}
                        placeholder={`Search ${user.name}'s Reviews`} 
>>>>>>>> featurethon-user-profile:frontend/app/friend/[userId].tsx
                        recent={true}
                        onSubmit={() => console.log("submit")}
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
<<<<<<<< HEAD:frontend/app/(profile)/[id].tsx
========
                    {userReviews.map((review) => (
                        <ReviewPreview
                        key={review.id}
                        plateName={review.plateName}
                        restaurantName={review.restaurantName}
                        tags={review.tags || []}
                        rating={review.rating.overall}
                        content={review.content}
                        user={user}>
                        </ReviewPreview>
                    ))}
>>>>>>>> featurethon-user-profile:frontend/app/friend/[userId].tsx
                </ThemedView>
            </ScrollView>
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
