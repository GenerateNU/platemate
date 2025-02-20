import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { SearchBox } from "@/components/SearchBox";
import SearchIcon from "@/assets/icons/search.svg";

export default function FeedScreen() {
    const [searchText, setSearchText] = React.useState("");

    return (
        <ThemedView style={styles.textContainer}>
            <SearchBox
                icon={<SearchIcon />}
                placeholder={"What are you hungry for?"}
                recent={true}
                name={"general"}
                onSubmit={() => console.log("submit")}
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
        padding: 24,
    },
});
