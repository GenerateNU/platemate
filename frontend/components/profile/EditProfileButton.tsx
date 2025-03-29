import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed/ThemedText";

export const EditProfileButton: React.FC<{ text: string; onPress: () => void }> = ({ text, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <ThemedText style={styles.buttonText}>{text}</ThemedText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 4,
        backgroundColor: "#FFCF0F",
        alignSelf: "center",
    },
    buttonText: {
        fontFamily: "Outfit",
        fontSize: 14,
        fontWeight: "500",
    },
});
