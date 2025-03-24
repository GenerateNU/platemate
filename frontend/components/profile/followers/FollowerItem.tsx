import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

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
            <View style={styles.followerInfo}>
                <Text style={styles.followerName}>{follower.name}</Text>
                <Text style={styles.followerUsername}>{follower.username}</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Following</Text>
            </TouchableOpacity>
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
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    followerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    followerName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#151619",
        fontFamily: "Outfit",
    },
    followerUsername: {
        fontSize: 14,
        color: "#727272",
        fontFamily: "Outfit",
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
        fontFamily: "Outfit",
        fontWeight: "500",
    },
});

export default FollowerItem;
