import { FilterGrid } from "../components/FilterGrid";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "../components/Button";
import { SortBy, SortOption } from "../components/SortBy";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native";

export default function Filter() {
    const [cuisineTags, setCuisineTags] = useState([
        { id: "Fast Food", selected: false },
        { id: "Pizza", selected: false },
        { id: "Chinese", selected: false },
        { id: "Sushi", selected: false },
        { id: "Mexico", selected: false },
        { id: "Indian", selected: false },
        { id: "Burgers", selected: false },
        { id: "Wings", selected: false },
        { id: "Thai", selected: false },
        { id: "Coffee", selected: false },
        { id: "Bubble Tea", selected: false },
        { id: "Korean", selected: false },
        { id: "Halal", selected: false },
        { id: "Vietnamese", selected: false },
        { id: "Hot Pot", selected: false },
        { id: "Greek", selected: false },
        { id: "Ice cream", selected: false },
        { id: "BBQ", selected: false },
        { id: "Italian", selected: false },
        { id: "Asian", selected: false },
        { id: "Seafood", selected: false },
        { id: "Soup", selected: false },
        { id: "Japanese", selected: false },
        { id: "Salad", selected: false },
        { id: "American", selected: false },
        { id: "Comfort food", selected: false },
        { id: "Breakfast", selected: false },
        { id: "Caribbean", selected: false },
        { id: "Bakery", selected: false },
        { id: "Bar", selected: false },
    ]);
    const [specificationTags, setSpecificationTags] = useState([
        { id: "Vegan", selected: false },
        { id: "Healthy", selected: false },
        { id: "Small-Business", selected: false },
        { id: "Trending", selected: false },
        { id: "Low-Cal", selected: false },
        { id: "Sit-Down", selected: false },
        { id: "To-Go", selected: false },
        { id: "BYOB", selected: false },
        { id: "Delivery-Available", selected: false },
        { id: "Reservation-Required", selected: false },
    ]);

    const [selectedSort, setSelectedSort] = useState<SortOption[]>([
        { title: "Taste Rating", direction: "none" },
        { title: "Value Rating", direction: "none" },
        { title: "Portion Rating", direction: "none" },
        { title: "Overall Rating", direction: "none" },
    ]);

    const cycleSelectedSort = (title: string) => {
        setSelectedSort((prevSort) => {
            return prevSort.map((item) => {
                if (item.title === title) {
                    // Cycle through directions: "none" -> "up" -> "down" -> "none"
                    switch (item.direction) {
                        case "none":
                            return { ...item, direction: "up" };
                        case "up":
                            return { ...item, direction: "down" };
                        case "down":
                            return { ...item, direction: "none" };
                    }
                }
                // console.log(`Selected sort:`, item);

                return { ...item, direction: "none" }; // Set all others to "none"
            });
        });
    };

    const toggleTag = (
        id: string,
        setTags: React.Dispatch<React.SetStateAction<{ id: string; selected: boolean }[]>>
    ) => {
        setTags((prevTags) => {
            const updated = prevTags.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t));

            // const selectedTags = updated.filter((t) => t.selected);
            // console.log(`Selected tags:`, selectedTags);

            return updated;
        });
    };

    const toggleCuisineTag = (id: string) => toggleTag(id, setCuisineTags);
    const toggleSpecificationTag = (id: string) => toggleTag(id, setSpecificationTags);

    return (
        // <SafeAreaView style={styles.container}>
        <ScrollView style={{ flex: 1, paddingTop: 10, backgroundColor: "#FFF" }}>
        
            <ThemedView style={styles.container}>
                <SortBy sortOptions={selectedSort} onSortOptionPress={cycleSelectedSort} />
                <FilterGrid filters={cuisineTags} title="🍝 Cuisines" onTagPress={toggleCuisineTag} />
                <FilterGrid filters={specificationTags} title="🍽️ Specifications" onTagPress={toggleSpecificationTag} />
                <Button
                    title={"Apply Filters"}
                    onPress={() => {}}
                    containerStyle={styles.applyButtonContainer}
                    textStyle={styles.applyButtonText}
                />
            </ThemedView>
        </ScrollView>
        
        // </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 99,
        paddingHorizontal: 31,
        gap: 30
    },
    applyButtonContainer: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 25,
        backgroundColor: "#285852",
    },
    applyButtonText: {
        fontFamily: "Source Sans 3",
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 18,
        letterSpacing: 0,
        color: "#FFFFFF",
    },
});
