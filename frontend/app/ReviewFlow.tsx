import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SearchBox } from "@/components/SearchBox";
import SearchIcon from "@/assets/icons/search.svg";
<<<<<<< HEAD
import UserInfoRowBase from "@/components/UserInfo/UserInfoRowBase";
import { EmojiTag } from "@/components/EmojiTag";
import { ProgressBar } from "@/components/ProgressBar";

=======
import { EmojiTagsGrid } from "@/components/EmojiTagsGrid";
>>>>>>> e52b38c (feat: create emoji tag grid)

const emojiTags = [
    { id: "avocado", emoji: "🥑", text: "Creamy" },
    { id: "tomato", emoji: "🍅", text: "Fresh and Crisp" },
    { id: "cheese", emoji: "🧀", text: "Well-Seasoned and Balanced" },
    { id: "spicy", emoji: "🌶", text: "Juicy" },
    { id: "drink", emoji: "🌶", text: "Refreshing" },
];

const ReviewFlow = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedTags, setSelectedTags] = useState<{ [key: string]: boolean }>({});

    const toggleTag = (id: string) => {
        setSelectedTags((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>
                Review Flow
            </ThemedText>

<<<<<<< HEAD
                    <EmojiTag
                        emoji="🍅"
                        text="Juicy"
                        selected={isTomatoSelected}
                        onPress={() => setTomatoSelected(!isTomatoSelected)}
                    />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <ProgressBar progress={25} />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <ProgressBar progress={50} />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <ProgressBar progress={75} />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <ProgressBar progress={100} />
                </View>
                {/* <SearchBox value={""} onChangeText={() => {}} onSubmit={() => {}} icon={<Text>🔍</Text>} /> */}
=======
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <EmojiTagsGrid
                    tags={emojiTags.map((tag) => ({
                        ...tag,
                        selected: !!selectedTags[tag.id],
                    }))}
                    onTagPress={toggleTag}
                />
>>>>>>> e52b38c (feat: create emoji tag grid)
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
