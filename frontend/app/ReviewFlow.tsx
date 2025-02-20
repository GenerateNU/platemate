import React from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MyReview } from "@/components/MyReview";

const ReviewFlow = () => {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>
                Review Flow
            </ThemedText>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <MyReview />
            </ScrollView>
        </ThemedView>
    );
};

export default ReviewFlow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: Dimensions.get("window").height * 0.12,
        gap: 16,
    },
    title: {
        fontWeight: "700",
    },
    scrollContainer: {
        gap: 16,
    },
});
