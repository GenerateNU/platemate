import { StyleSheet } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed/ThemedText";

type ProfileIdentityProps = {
    name: string;
    username: string;
};

const ProfileIdentity = (props: ProfileIdentityProps) => {
    return (
        <>
            <ThemedText style={styles.nameText}>{props.name}</ThemedText>
            <ThemedText style={styles.usernameText}>@{props.username}</ThemedText>
        </>
    );
};

const styles = StyleSheet.create({
    nameText: {
        alignSelf: "center",
        fontSize: 28,
        paddingTop: 24,
        fontWeight: "bold",
        fontFamily: "Nunito",
    },
    usernameText: {
        alignSelf: "center",
        fontFamily: "Nunito",
    },
});

export default ProfileIdentity;
