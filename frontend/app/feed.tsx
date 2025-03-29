import { Dimensions, StyleSheet, View } from "react-native";

import { ThemedView } from "@/components/themed/ThemedView";
import React, { useContext, useState } from "react";
import { SearchBox } from "@/components/SearchBox";
import { SearchIcon } from "@/components/icons/Icons";
import FeedTabs from "@/components/Feed/FeedTabs";
import FeedContent from "@/components/Feed/FeedContent";
import { FilterContext } from "@/context/filter-context";

export default function FeedScreen() {
    const [activeTab, setActiveTab] = useState(0);
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("Filter component must be used within a FilterProvider");
    }
    const { handleSearch, searchText, setSearchText } = context;

    return (
        <ThemedView style={styles.textContainer}>
            <View style={{ flex: 0 }}>
                <SearchBox
                    icon={<SearchIcon />}
                    placeholder={"What are you hungry for?"}
                    recent={true}
                    name={"general"}
                    onSubmit={handleSearch}
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                    filter={true}
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
