import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";

export const TagButton = ({ title, filter }: { title: string; filter?: boolean}) => {
    const [inverted, setInverted] = useState(false);

    const handlePress = () => {
        if (filter) {
            setInverted(!inverted);
        }
    };

    return (
        <Button 
            title={title} 
            onPress={handlePress} 
            containerStyle={[
                filter ? styles.filterButton : styles.tagButton, // Use filterButton if filter is true, otherwise tagButton
                filter && (inverted ? styles.filterUnhighlightedButton : styles.filterHighlightedButton)
            ]} 
            textStyle={[
                styles.tagText,
                filter && styles.filterText
            ]} 
        />
    );};

interface TagButtonProps {
    tags: string[];
    filter?: boolean;
}

export function RestaurantTags({ tags, filter }: TagButtonProps) {
    return (
        <ThemedView style={styles.tagContainer}>
            {tags.map((tag, index) => (
                <TagButton key={index} title={tag} filter={filter} />
            ))}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "flex-start",
    },
    tagButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#285852",
    },
    tagText: {
        textAlign: "center",
        color: "#285852",
        fontFamily: "Outfit",
        fontWeight: "500",
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: 0,
    },
    filterButton: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#000000",
    },
    filterHighlightedButton: { // padding and corner radius? slightly different vs restaurant
        backgroundColor: "#FFCF0F",
        borderColor: "#FFCF0F",
    },
    filterUnhighlightedButton: {
        backgroundColor: "#FFFFFF",
        borderColor: "#FFCF0F",
    },
    
    filterText: {
        textAlign: "center",
        color: "#000000",
        fontFamily: "Poppins",
        fontWeight: "500",
        fontSize: 12,
        lineHeight: 20,
        letterSpacing: 0,
    },


});
