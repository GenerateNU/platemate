import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";

interface IconTextProps {
    text: string;
    Icon: React.FC<SvgProps>;
}

export const RestaurantDetailItem = ({ text, Icon }: IconTextProps) => {
    return (
        <View style={styles.container}>
            <Icon width={18} height={18} stroke="black" />
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
        color: "#285852",
        fontFamily: "Outfit"
    },
});