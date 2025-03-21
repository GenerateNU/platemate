import { Image, StyleSheet } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";

type BannerAndAvatarProps = {
    bannerURL: string;
    avatarURL: string;
};

const BannerAndAvatar = (props: BannerAndAvatarProps) => {
    return (
        <ThemedView style={styles.bannerContainer}>
            <Image
                source={{
                    uri: props.bannerURL,
                }}
                style={styles.bannerImage}
            />
            <ThemedView style={styles.avatarContainer}>
                <Image source={{ uri: props.avatarURL }} style={styles.avatar} />
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        width: "100%",
        position: "relative",
        alignItems: "flex-start",
        backgroundColor: "white",
    },
    bannerImage: {
        width: "100%",
        height: 124,
    },
    avatarContainer: {
        position: "absolute",
        bottom: -50,
        left: 20,
        zIndex: 1,
        borderRadius: 72,
        borderColor: "white",
        borderWidth: 2,
    },
    avatar: {
        width: 144,
        height: 144,
        borderRadius: 72,
        borderWidth: 3,
        borderColor: "white",
        backgroundColor: "white",
    },
});

export default BannerAndAvatar;
