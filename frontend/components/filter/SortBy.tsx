import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import { ArrowUpward, ArrowDownward } from "@/components/icons/Icons";
 
interface SortOption {
    id: string;
    direction: "none" | "up" | "down";
}

interface SortRowProps {
    id: string;
    selectedSort: SortOption; // the title of the current row selected, if any and the direction
    // Function to update the sort selection in the parent
    onPress: () => void;
}

// TODO: figure out if possible to sort by multiple rows, or just one
export function SortRow({ id: id, selectedSort, onPress }: SortRowProps) {
    const getSubtitle = () => {
        switch (selectedSort.direction) {
            case "up":
                return "Highest to lowest";
            case "down":
                return "Lowest to highest";
            case "none":
                return "-";
        }
    };

    return (
        <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.sortFieldTitle}>{id}</Text>
                <Text style={styles.subTitle}>{getSubtitle()}</Text>
            </View>
            <Button title="" containerStyle={styles.sortButton} onPress={onPress}>
                {/* Conditionally render the arrow icon based on the state */}
                {selectedSort.direction === "up" && <ArrowUpward/>}
                {selectedSort.direction === "down" && <ArrowDownward width={24} height={24} />}
                {selectedSort.direction === "none" && <View style={styles.blankIcon} />}
            </Button>
        </View>
    );
}

interface SortByProps {
    sortOptions: SortOption[];
    onSortOptionPress: (title: string) => void;
}

export function SortBy({ sortOptions, onSortOptionPress }: SortByProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>📶 Sort By</Text>
            <View style={styles.sortRowsContainer}>
                {sortOptions.map((option, index) => (
                    <SortRow
                        key={index}
                        id={option.id}
                        selectedSort={option}
                        onPress={() => onSortOptionPress(option.id)}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 14,
    },
    title: {
        fontFamily: "Inter",
        fontWeight: "600",
        fontSize: 24,
        lineHeight: 28,
        letterSpacing: 0,
        color: "#151619",
        marginBottom: 4, // Bottom margin
    },
    sortRowsContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
    },
    rowContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    sortButton: {
        paddingVertical: 9,
        paddingHorizontal: 9, // increased padding to make the border on the outside
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#DDD",
        justifyContent: "center",
        alignItems: "center",
    },
    sortFieldTitle: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0,
        color: "#000000",
        marginBottom: 0,
    },
    subTitle: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 28,
        letterSpacing: 0,
        color: "#727272",
        marginLeft: 2,
        marginTop: -8, // line height of title and subtitle overlap by 8
    },
    textContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    blankIcon: {
        width: 24,
        height: 24, // same as size as the arrow icon i think? DOUBLE CHECK
    },
});
