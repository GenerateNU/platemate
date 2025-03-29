import { Image, StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import React from "react";

type ProfileAvatarProps = {
    url: string;
};

const ProfileAvatar = (props: ProfileAvatarProps) => {
    return (
        <ThemedView style={{ alignItems: "center", backgroundColor: "transparent" }}>
            <Image source={{ uri: props.url }} style={styles.avatar} />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    avatar: {
        width: 132,
        height: 132,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: "white",
        marginTop: 40,
        zIndex: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.5,
        elevation: 5,
    },
});

export default ProfileAvatar;
