import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed/ThemedText";
import { useState } from "react";
import { createFollow, deleteFollow } from "@/api/user";
import { useUser } from "@/context/user-context";

export const FollowButton: React.FC<{ text: string, userToFollowId: string }> = ({ text, userToFollowId }) => {
    const [isPressed, setIsPressed] = useState(true);
    const [buttonText, setButtonText] = useState(text);
    const { user } = useUser(); // Get current user


    const handlePress = async () => {
        if (!user) {
            console.log("User must be logged in to follow others");
            return;
        }

        if (buttonText == "Friends") {
            console.log("Unfollowing user with ID:", userToFollowId);
            console.log("User ID:", user.id);
            setIsPressed(false);
            setButtonText("Follow");
            await deleteFollow(user.id, userToFollowId);

        } else {
            console.log("Following user with ID:", userToFollowId);
            console.log("User ID:", user.id);

            setIsPressed(true);
            setButtonText("Friends");
            await createFollow(user.id, userToFollowId);

        }
    };

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: isPressed ? "#FFFCE4" : "#FFCF0F" }]} // set color dynamically
            onPress={handlePress}>
            <ThemedText style={styles.buttonText}>{buttonText}</ThemedText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 4,
        alignSelf: "center",
    },
    buttonText: {
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: "500",
    },
});
