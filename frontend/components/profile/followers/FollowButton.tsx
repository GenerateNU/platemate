import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed/ThemedText";
import { useState } from "react";

export const FollowButton: React.FC<{ text: string }> = ({ text }) => {
    const [isPressed, setIsPressed] = useState(true);
    const [buttonText, setButtonText] = useState(text);

    const handlePress = () => {
        if (buttonText === "Following") {
            setIsPressed(false);
            setButtonText("Follow");
        } else {
            setIsPressed(true);
            setButtonText("Following");
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
