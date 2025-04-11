import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FollowButton } from "./FollowButton";
import { router } from "expo-router";

type Follower = {
    id: string;
    name: string;
    username: string;
    avatar: string;
};

type FollowerItemProps = {
    follower: Follower;
};

const FollowerItem = ({ follower }: FollowerItemProps) => {
    return (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.followerItem}
                onPress={() => router.push(`/friend/${follower.id}`)}
                android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: follower.avatar }} style={styles.avatar} resizeMode="cover" />
                </View>

                <View style={styles.namesContainer}>
                    <Text style={styles.followerName} numberOfLines={1}>
                        {follower.name}
                    </Text>
                    <Text style={styles.followerUsername} numberOfLines={1}>
                        {follower.username}
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <FollowButton isFollowing={true} userToFollowId={follower.id} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        marginVertical: 4,
        marginHorizontal: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        overflow: "hidden",
    },
    followerItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        width: "100%",
        justifyContent: "space-between",
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    namesContainer: {
        flex: 1,
        justifyContent: "center",
        marginRight: 8,
    },
    followerName: {
        color: "rgba(0, 0, 0, 0.87)",
        fontFamily: "Roboto",
        fontSize: 16,
        fontWeight: "500",
        letterSpacing: 0.15,
        marginBottom: 2,
    },
    followerUsername: {
        color: "rgba(0, 0, 0, 0.6)",
        fontFamily: "Roboto",
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.25,
    },
    buttonContainer: {
        marginLeft: 8,
    },
});

export default FollowerItem;
