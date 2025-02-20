import React from "react";
import { View, StyleSheet } from "react-native";
import { EmojiTag } from "./EmojiTag";

interface EmojiTagData {
    id: string;
    emoji: string;
    text: string;
    selected?: boolean;
}

interface EmojiTagsGridProps {
    tags: EmojiTagData[];
    onTagPress?: (id: string) => void;
}

export function EmojiTagsGrid({ tags, onTagPress }: EmojiTagsGridProps) {
    return (
        <View style={styles.container}>
            {tags.map((tag) => (
                <EmojiTag
                    key={tag.id}
                    emoji={tag.emoji}
                    text={tag.text}
                    selected={tag.selected}
                    onPress={() => onTagPress?.(tag.id)}
                    style={styles.tag}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    tag: {
        marginRight: 25,
        marginBottom: 24,
    },
});
