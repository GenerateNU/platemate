import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { TagButton } from "@/components/RestaurantTags";

interface FilterProps {
    filters: string[];
    title: string;
    // TODO: emoji: string; 
}

export function Filter({ filters, title }: FilterProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <FilterGrid filters={filters} />
        </View>
    );
}
interface FilterGridProps {
    filters: string[];
}

export function FilterGrid({ filters }: FilterGridProps) {
    return (
        <View style={styles.filterContainer}>
            {filters.map((filterTag, index) => (
                <TagButton key={index} title={filterTag} filter={true} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",  // Stack the title and grid vertically
        alignItems: "flex-start", // Align both title and grid to the left
        gap: 14, // Space between title and grid
    },
    title: {
        fontFamily: "Inter",
        fontWeight: "600",
        fontSize: 24,
        lineHeight: 28,
        letterSpacing: 0,
        color: "#151619",
        marginBottom: 14, // Bottom margin
    },
    filterContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: 25,
    },
});
