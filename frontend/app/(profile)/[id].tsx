import React, { useEffect } from "react";
import { ThemedView } from "@/components/themed/ThemedView";
import { Dimensions, ScrollView, StatusBar, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileIdentity from "@/components/profile/ProfileIdentity";
import ProfileMetrics from "@/components/profile/ProfileMetrics";
import { EditProfileButton } from "@/components/profile/EditProfileButton";
import { useNavigation } from "expo-router";
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
    // const { id } = useLocalSearchParams<{ id: string }>();

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const [searchText, setSearchText] = React.useState("");

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient
                colors={["white", "#FFFCE4"]}
                style={styles.topOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
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
                    </ThemedText>
                    {/* Made a search box with a filter/sort component as its own component */}
                    <SearchBoxFilter
                        placeholder="Search my reviews"
                        recent={true}
                        onSubmit={() => console.log("submit")}
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
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
