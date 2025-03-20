import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import { ThemedView } from "@/components/ThemedView";

const TagButton = ({ title }: { title: string }) => {
    return <Button title={title} onPress={() => {}} containerStyle={styles.tagButton} textStyle={styles.tagText} />;
};

interface TagButtonProps {
    tags: string[];
}

export function FilterTags({ tags }: TagButtonProps) {
    return (
        <ThemedView style={styles.tagContainer}>
            {tags.map((tag, index) => (
                <TagButton key={index} title={tag} />
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
});
