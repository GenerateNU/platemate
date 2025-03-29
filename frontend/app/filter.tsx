import { FilterGrid } from "../components/filter/FilterGrid";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Button } from "../components/Button";
import { SortBy } from "../components/filter/SortBy";
import { ThemedView } from "@/components/themed/ThemedView";
import { ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { FilterContext } from "@/context/filter-context";

export default function Filter() {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("Filter component must be used within a FilterProvider");
    }

    const {
        cuisineTags,
        specificationTags,
        selectedSort,
        cycleSelectedSort,
        toggleCuisineTag,
        toggleSpecificationTag,
        handleSearch,
    } = context;

    const navigate = useNavigation();

    const handleApplyFilters = () => {
        handleSearch();
        navigate.goBack();
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <ThemedView style={styles.container}>
                <SortBy sortOptions={selectedSort} onSortOptionPress={cycleSelectedSort} />
                <FilterGrid filters={cuisineTags} title="🍝 Cuisines" onTagPress={toggleCuisineTag} />
                <FilterGrid filters={specificationTags} title="🍽️ Specifications" onTagPress={toggleSpecificationTag} />
                <Button
                    title={"Apply Filters"}
                    onPress={handleApplyFilters}
                    containerStyle={styles.applyButtonContainer}
                    textStyle={styles.applyButtonText}
                />
            </ThemedView>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 56,
        paddingBottom: 100,
        paddingLeft: 24,
        paddingRight: 24,
        gap: 28,
    },
    applyButtonContainer: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 25,
        backgroundColor: Colors.primary,
    },
    applyButtonText: {
        fontFamily: "Source Sans 3",
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 18,
        letterSpacing: 0,
        color: Colors.white,
    },
});
