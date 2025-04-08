import React from "react";
import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import { ArrowUpward, ArrowDownward } from "@/components/icons/Icons";
import { TSortOption } from "@/types/filter";
import { Colors } from "@/constants/Colors";

interface SortRowProps {
    id: string;
    selectedSort: TSortOption; // the title of the current row selected, if any and the direction
    // Function to update the sort selection in the parent
    onPress: () => void;
}

export function SortRow({ id: id, selectedSort, onPress }: SortRowProps) {
    const [subtitle, setSubtitle] = useState<string>("-");
    // Update subtitle when direction changes
    useEffect(() => {
        switch (selectedSort.direction) {
            case "up":
                setSubtitle("Highest to lowest");
                break;
            case "down":
                setSubtitle("Lowest to highest");
                break;
            case "none":
                setSubtitle("-");
                break;
        }
    }, [selectedSort.direction]);

    return (
        <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.sortFieldTitle}>{id}</Text>
                <Text style={styles.subTitle}>{subtitle}</Text>
            </View>
            <Button title="" containerStyle={styles.sortButton} onPress={onPress}>
                {/* Conditionally render the arrow icon based on the state */}
                {selectedSort.direction === "up" && <ArrowUpward />}
                {selectedSort.direction === "down" && <ArrowDownward />}
                {selectedSort.direction === "none" && <View style={styles.blankIcon} />}
            </Button>
        </View>
    );
}

interface SortByProps {
    sortOptions: TSortOption[];
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
        color: Colors.darkGrey,
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
        paddingVertical: 8,
        paddingHorizontal: 8, // increased padding to make the border on the outside
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.borderPrimary,
        justifyContent: "center",
        alignItems: "center",
    },
    sortFieldTitle: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0,
        color: Colors.black,
        marginBottom: 0,
    },
    subTitle: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 28,
        letterSpacing: 0,
        color: Colors.grey,
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
        height: 24,
    },
});
