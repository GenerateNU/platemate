import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { FilterTagButton } from "@/components/filter/FilterTags";
import { TFilterItem, TFilterId } from "@/types/filter";


interface FilterProps {
    filters: TFilterItem[];
    onTagPress?: (id: TFilterId) => void;
    title: string;
}

export function FilterGrid({ filters, onTagPress, title }: FilterProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <FilterTagGrid filters={filters} onTagPress={onTagPress} />
        </View>
    );
}
interface FilterGridProps {
    filters: TFilterItem[];
    onTagPress?: (id: TFilterId) => void;
}

export function FilterTagGrid({ filters, onTagPress }: FilterGridProps) {
    return (
        <View style={styles.filterContainer}>
            {filters.map((tag, index) => (
                <FilterTagButton
                    key={index}
                    id={tag.id}
                    onPress={() => onTagPress?.(tag.id)}
                    selected={tag.selected}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column", // Stack the title and grid vertically
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
        marginBottom: 11,
    },
    filterContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: 25,
        rowGap: 24,
    },
});
