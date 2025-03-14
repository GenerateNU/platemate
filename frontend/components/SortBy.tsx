import React, { useState } from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import ArrowUpward from "@/assets/icons/arrow_upward.svg";

interface SortRowProps {
    title: string;

}

export function SortRow({ title }: SortRowProps) {
    const [isArrowUp, setIsArrowUp] = useState(false); // Track arrow state

    // Toggle arrow state on button press
    const handleButtonClick = () => {
        setIsArrowUp(prev => !prev);
    };
    
    return (
        <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.sortFieldTitle}>{title}</Text>
                <Text style={styles.subTitle}> - </Text>
            </View>
            <Button title="" containerStyle={styles.sortButton} onPress={handleButtonClick}>
                <ArrowUpward 
                
                    style={{ opacity: isArrowUp ? 1 : 0
                    }} />
            </Button>
        </View>
    );
}

interface SortByProps {
    titles: string[];
}

export function SortBy( { titles }: SortByProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sort By</Text>
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
        marginBottom: 14, // Bottom margin
    },
    sortRowsContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
    },
    rowContainer: {
        justifyContent: "space-between", // Space out the children: push button to the right
        flexDirection: "row", // Set row layout for the container
        alignItems: "center", // Align items vertically in the center
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
    },
    subTitle: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 28,
        letterSpacing: 0,
        color: "#727272",
    },
    textContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",

    }
});
