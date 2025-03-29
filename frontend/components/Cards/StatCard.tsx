import { View, StyleSheet, Text } from "react-native";
import React from "react";

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, subtitle }) => (
    <View style={styles.statCard}>
        {icon}
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
);

const styles = StyleSheet.create({
    statCard: {
        aspectRatio: 1,
        alignItems: "center",
        padding: 12,
        backgroundColor: "#f5f5f5",
        borderRadius: 16,
    },
    statTitle: {
        fontSize: 14,
        lineHeight: 28,
        fontWeight: "600",
        textAlign: "center",
        color: "#000000",
        fontFamily: "Outfit",
    },
    statSubtitle: {
        fontSize: 9,
        fontWeight: "400",
        textAlign: "center",
        color: "#727272",
        fontFamily: "Outfit",
    },
});
