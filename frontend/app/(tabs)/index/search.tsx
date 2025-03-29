import React, { useContext } from "react";
import { ScrollView, StyleSheet, Dimensions, View, Text } from "react-native";

import { ThemedView } from "@/components/themed/ThemedView";
import MenuItemPreview from "@/components/Cards/MenuItemPreview";
import { SearchBox } from "@/components/SearchBox";
import { SearchIcon } from "@/components/icons/Icons";
import { FilterContext } from "@/context/filter-context";
import { TMenuItem } from "@/types/menu-item";

export default function SearchScreen() {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("Filter component must be used within a FilterProvider");
    }
    const { handleSearch, searchText, setSearchText, searchResults } = context;

    return (
        <ThemedView style={styles.container}>
            <View style={styles.searchWrapper}>
                <SearchBox
                    icon={<SearchIcon />}
                    placeholder="What are you hungry for?"
                    recent={true}
                    name="general"
                    onSubmit={handleSearch}
                    value={searchText}
                    onChangeText={setSearchText}
                    filter={true}
                />
                {/* Dynamically display results count */}
                <Text style={styles.resultsText}>Results</Text>
            </View>

            <ScrollView contentContainerStyle={styles.resultsContainer} showsVerticalScrollIndicator={false}>
                {searchResults.map((item: TMenuItem, index: number) => (
                    <MenuItemPreview
                        key={index}
                        plateName={item.name}
                        content={item.content}
                        tags={item.tags}
                        picture={item.picture}
                        rating={item.avgRating?.overall ?? 0}
                        restaurantName={item.restaurantId}
                    />
                ))}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        gap: 16,
    },
    searchWrapper: {
        flexDirection: "column", // Stack search box and results text
        flexShrink: 0, // Prevents shrinking when history appears
        gap: 8, // Add space between search and results text
    },
    resultsText: {
        fontSize: 24,
        fontWeight: 700,
        textAlign: "center",
        fontFamily: "Source Sans 3",
        marginTop: 8, // Adds space below search box
    },
    resultsContainer: {
        gap: 22,
    },
});
