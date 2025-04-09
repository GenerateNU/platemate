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
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#FFCF0F",
        alignSelf: "center",
        textAlign: "center",
    },
    buttonText: {
        fontFamily: "Source Sans 3",
        fontSize: 14,
        fontWeight: "500",
    },
});
