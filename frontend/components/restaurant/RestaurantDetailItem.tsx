import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ClockIcon, MarkerIcon } from "@/components/icons/Icons";

interface IconTextProps {
    text: string;
    icon: "clock" | "marker";
}

export const RestaurantDetailItem = ({ text, icon }: IconTextProps) => {
    return (
        <View style={styles.container}>
            {icon === "clock" ? <ClockIcon /> : <MarkerIcon />}
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    text: {
        fontSize: 14,
        color: "black",
        fontFamily: "Nunito",
        fontWeight: 500,
    },
});
