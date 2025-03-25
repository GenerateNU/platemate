import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import React from "react";

type ProfileMetricProps = {
    numFriends: number;
    numReviews: number;
    averageRating: number;
};

const ProfileMetrics = (props: ProfileMetricProps) => {
    return (
        <ThemedView style={styles.container}>
            <View style={{ alignItems: "center", marginRight: 24, backgroundColor: "transparent" }}>
                <ThemedText style={styles.statNumber}>{props.numReviews}</ThemedText>
                <ThemedText style={styles.statLabel}>reviews</ThemedText>
            </View>

            <View style={{ alignItems: "center", backgroundColor: "transparent" }}>
                <ThemedText style={styles.statNumber}>{props.numFriends}</ThemedText>
                <ThemedText style={styles.statLabel}>friends</ThemedText>
            </View>

            <View style={{ alignItems: "center", marginLeft: 24, backgroundColor: "transparent" }}>
                <ThemedText style={styles.statNumber}>{props.averageRating}</ThemedText>
                <ThemedText style={styles.statLabel}>avg. rating</ThemedText>
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 24,
        paddingBottom: 12,
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 500,
        fontFamily: "Outfit",
        paddingTop: 4,
    },
    statLabel: {
        fontSize: 16,
        color: "#666",
        fontFamily: "Outfit",
    },
});

export default ProfileMetrics;
