import React from "react";
import { View, Text, StyleSheet, ImageSourcePropType } from "react-native";
import { Avatar } from "./Avatar";
import LocationIcon from "@/assets/icons/location_on.svg";
import { Button } from "./Button";

export interface ProfileProps {
    imageSource?: ImageSourcePropType;
    name?: string;
    username?: string;
    location?: string;
    reviews?: number;
    friends?: number;
    avgRating?: number;
}

const UserProfile = ({ imageSource, name, username, location, reviews, friends, avgRating }: ProfileProps) => {
    return (
        <View style={styles.container}>
            {/* Header Section (Avatar, Name, Username, Location, Menu) */}
            <View style={styles.header}>
                {/* Avatar -- maybe add size tbd */}
                <Avatar imageSource={imageSource} size={126} />

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.username}>@{username}</Text>
                    <View style={styles.locationContainer}>
                        {/* Location Icon (Replace with actual icon component if needed) */}
                        <LocationIcon width={14} height={14} />
                        <Text style={styles.location}>{location}</Text>
                    </View>
                </View>
            </View>

            {/* Reviews, Friends, Avg Rating */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{reviews}</Text>
                    <Text style={styles.statLabel}>reviews</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{friends}</Text>
                    <Text style={styles.statLabel}>friends</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{avgRating}</Text>
                    <Text style={styles.statLabel}>avg. rating</Text>
                </View>
            </View>

            {/* edit this later to be a button! */}
            <Button
                title="Edit Profile"
                onPress={() => alert("Edit Profle Button Was Pressed!")}
                containerStyle={styles.editProfileButtonContainer}
                textStyle={styles.editProfileButtonText}
            />
            <Text style={styles.editProfileButtonText}>Edit profile</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#ffffff", // Changed to white
        borderRadius: 0, // Removed border radius
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 }, // Reduced shadow
        shadowOpacity: 0.1, // Reduced shadow opacity
        shadowRadius: 2, // Reduced shadow radius
        elevation: 3, // Reduced elevation
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        color: "#151619",
        textAlign: "center",
        fontFamily: "Inter",
        fontSize: 28,
        fontStyle: "normal",
        fontWeight: "bold",
        lineHeight: 28,
    },
    username: {
        fontSize: 12,
        color: "#000",
        textAlign: "center",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        gap: 2,
    },
    location: {
        fontSize: 12,
        color: "#000000",
        textAlign: "center",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
    },
    menuIcon: {
        fontSize: 24,
    },
    statsContainer: {
        flexDirection: "row",
        width: 261,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 58,
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        color: "#000000",
        textAlign: "center",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontSize: 32,
        fontWeight: 500,
        lineHeight: 28,
    },
    statLabel: {
        fontSize: 12,
        color: "#727272", // Lighter color
        textAlign: "center",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
    },
    editProfileButtonContainer: {
        display: "flex", // Use flexDirection: 'row' for React Native
        flexDirection: "row",
        paddingVertical: 4, // 4px top and bottom
        paddingHorizontal: 12, // 12px left and right
        justifyContent: "center", // Center content horizontally
        alignItems: "center", // Center content vertically
        gap: 4,
        backgroundColor: "#285852",
    },
    editProfileButtonText: {
        fontSize: 14,
        color: "#FFFFFF",
        fontFamily: "Source Sans 3",
        textAlign: "center",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: 18,
    },
});

export default UserProfile;
