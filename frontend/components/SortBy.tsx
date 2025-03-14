import React, { useState } from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import ArrowUpward from "@/assets/icons/arrow_upward.svg";

interface SortRowProps {
    title: string;
}

export function SortRow({ title }: SortRowProps) {
    const [arrowState, setArrowState] = useState<"up" | "down" | "none">("none");

    // Toggle arrow state on button press
    const handleButtonClick = () => {
        setArrowState((prev) => {
            // Cycle through 'up', 'down', and 'none' states
            if (prev === "none") return "up";
            if (prev === "up") return "down";
            return "none";
        });
    };
    const getSubtitle = () => {
        switch (arrowState) {
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
                <Text style={styles.sortFieldTitle}>{title}</Text>
                <Text style={styles.subTitle}>{getSubtitle()}</Text>
            </View>
            <Button title="" containerStyle={styles.sortButton} onPress={handleButtonClick}>
                {/* Conditionally render the arrow icon based on the state */}
                {arrowState === "up" && <ArrowUpward width={24} height={24} />}
                {arrowState === "down" && <View style={styles.blankIcon} />}
                {arrowState === "none" && <View style={styles.blankIcon} />}
            </Button>
        </View>
    );
}

interface SortByProps {
    titles: string[];
}

export function SortBy({ titles }: SortByProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>📶 Sort By</Text>
            <View style={styles.sortRowsContainer}>
                {titles.map((title, index) => (
                    <SortRow key={index} title={title} />
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
