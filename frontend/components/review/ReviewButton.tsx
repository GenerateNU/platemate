import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ReviewButtonProps {
    onPress?: () => void;
    restaurantId: string;
    menuItemName: string;
    dishImageUrl?: string;
}

export function ReviewButton({ onPress, restaurantId, menuItemName, dishImageUrl }: ReviewButtonProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress?.()}>
            <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: "#FFCF0F",
        position: "absolute",
        bottom: 120,
        right: 24,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 999,
    },
});
