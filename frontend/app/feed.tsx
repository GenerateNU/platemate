import { Dimensions, StyleSheet, View } from "react-native";

import { ThemedView } from "@/components/themed/ThemedView";
import React, { useState } from "react";
import { SearchBox } from "@/components/SearchBox";
import { SearchIcon } from "@/components/icons/Icons";
import FeedTabs from "@/components/feed/FeedTabs";
import FeedContent from "@/components/feed/FeedContent";

export default function FeedScreen() {
    const [searchText, setSearchText] = React.useState("");
    const [activeTab, setActiveTab] = useState(0);

    return (
        <ThemedView style={styles.textContainer}>
            <View style={{ flex: 0 }}>
                <SearchBox
                    icon={<SearchIcon />}
                    placeholder={"What are you hungry for?"}
                    recent={true}
                    name={"general"}
                    onSubmit={() => console.log("submit")}
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
                <View style={{ marginTop: 24, marginBottom: 24 }}>
                    <FeedTabs tabs={["Friends", "Recommended"]} activeTab={activeTab} setActiveTab={setActiveTab} />
                </View>

                <FeedContent activeTab={activeTab} />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        padding: 24,
        flex: 1,
        gap: 16,
        paddingTop: Dimensions.get("window").height * 0.12,
    },
});
