import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FollowButton } from "./FollowButton";

type Follower = {
    name: string;
    username: string;
    avatar: string;
};

type FollowerItemProps = {
    follower: Follower;
};

const FollowerItem = ({ follower }: FollowerItemProps) => {
    return (
        <TouchableOpacity style={styles.followerItem}>
            <Image
                source={{ uri: follower.avatar }}
                style={styles.avatar}
                defaultSource={{ uri: "/api/placeholder/50/50" }}
            />
            <View style={styles.namesContainer}>
                <Text style={styles.followerUsername}>{follower.username}</Text>
                <Text style={styles.followerName}>{follower.name}</Text>
            </View>
            {/* Hard coded "Friends" for now */}
            <FollowButton text={"Friends"} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    followerItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
        width: "95%",
        gap: 8,
    },
    avatar: {
        width: 78.897,
        height: 78.897,
        borderRadius: 78.897,
    },
    followerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    followerUsername: {
        color: "#000",
        fontFamily: "Inter",
        fontSize: 12,
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 20,
        letterSpacing: -0.132,
    },
    followerName: {
        color: "#000",
        fontFamily: "Inter",
        fontSize: 15,
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: 20,
        letterSpacing: -0.165,
    },
    followButton: {
        backgroundColor: "#F0F0F0",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    followButtonText: {
        fontSize: 14,
        color: "#151619",
        fontFamily: "Source Sans 3",
        fontWeight: "500",
    },
    namesContainer: {
        display: "flex",
        flex: 1,
        width: 103,
        flexDirection: "column",
        alignItems: "flex-start",
    },
    friendsStatsContainer: {
        display: "flex",
        width: 175.295,
        height: 37,
        paddingVertical: 6,
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
    },
    friendsStatsText: {
        color: "#000",
        fontFamily: "Inter",
        fontSize: 10,
        fontWeight: 400,
        lineHeight: 20,
        letterSpacing: -0.11,
    },
});

export default FollowerItem;
