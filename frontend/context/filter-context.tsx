import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";
import { TSortOption, TFilterItem, TSortOptionKey, TFilterId, TMenuItemSearchResult } from "@/types/filter";
import { TMenuItem } from "@/types/menu-item";
import { getMenuItems } from "@/api/menu-items";

const API_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
export interface MenuItemQuery {
    Name: string;
    Tags: string[];
    DietaryRestrictions: string[];
    SortBy: TSortOptionKey | null;
    SortOrder: string | null;
}

export interface FilterContextType {
    cuisineTags: TFilterItem[];
    specificationTags: TFilterItem[];
    selectedSort: TSortOption[];
    searchText: string;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    selectedSortSelection: string | null;
    selectedSortDirection: string | null;
    selectedCuisineTags: string[];
    selectedSpecificationTags: string[];
    handleSearch: () => Promise<void>;
    cycleSelectedSort: (title: string) => void;
    toggleCuisineTag: (id: TFilterId) => void;
    toggleSpecificationTag: (id: TFilterId) => void;
    searchResults: TMenuItem[];
}
export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState<TMenuItem[]>([]);
    const [cuisineTags, setCuisineTags] = useState<TFilterItem[]>([
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
    const [specificationTags, setSpecificationTags] = useState<TFilterItem[]>([
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

    const [selectedSort, setSelectedSort] = useState<TSortOption[]>([
        { id: "Taste Rating", direction: "none" },
        { id: "Value Rating", direction: "none" },
        { id: "Portion Rating", direction: "none" },
        { id: "Overall Rating", direction: "none" },
    ]);

    const cycleSelectedSort = (title: string) => {
        setSelectedSort((prevSort) => {
            return prevSort.map((item) => {
                if (item.id === title) {
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

                return { ...item, direction: "none" }; // Set all others to "none"
            });
        });
    };

    const toggleTag = (id: TFilterId, setTags: React.Dispatch<React.SetStateAction<TFilterItem[]>>) => {
        setTags((prevTags) => {
            const updated = prevTags.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t));

            return updated;
        });
    };

    const handleSearch = async () => {
        const selectedCuisineTags = cuisineTags.filter((tag) => tag.selected).map((tag) => tag.id);
        const selectedSpecificationTags = specificationTags.filter((tag) => tag.selected).map((tag) => tag.id);
        const selectedSortOption = selectedSort.find((option) => option.direction !== "none");
        const sortOrder =
            selectedSortOption?.direction === "up" ? "asc" : selectedSortOption?.direction === "down" ? "desc" : undefined;

        const sortFieldMapping: Record<TSortOptionKey, string> = {
            "Taste Rating": "avgRating.taste",
            "Value Rating": "avgRating.value",
            "Portion Rating": "avgRating.portion",
            "Overall Rating": "avgRating.overall",
        };
        const sortBy = sortFieldMapping[selectedSortOption?.id || ""] || undefined;

        const queryParams = {
            name: searchText,
            tags: [...selectedCuisineTags, ...selectedSpecificationTags],
            limit: 10,
            skip: 0,
            sortBy: sortBy,
            sortOrder: sortOrder,
        };
        console.log("Query Params:", queryParams);

        try {
            const response = await getMenuItems({
                name: queryParams.name,
                tags: queryParams.tags,
                page: queryParams.skip,  // Correctly map skip to page
                limit: queryParams.limit,
                sortBy: queryParams.sortBy,
                sortOrder: queryParams.sortOrder,
            });
            setSearchResults(response);
            console.log("Transformed Results:", response);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const selectedSortSelection = selectedSort.find((option) => option.direction !== "none")?.id || null;
    const selectedSortDirection = selectedSort.find((option) => option.direction !== "none")?.direction || null;
    const selectedCuisineTags = cuisineTags.filter((tag) => tag.selected).map((tag) => tag.id);
    const selectedSpecificationTags = specificationTags.filter((tag) => tag.selected).map((tag) => tag.id);

    return (
        <FilterContext.Provider
            value={{
                searchText,
                setSearchText,
                cuisineTags,
                specificationTags,
                selectedSort,
                selectedSortSelection,
                selectedSortDirection,
                selectedCuisineTags,
                selectedSpecificationTags,
                handleSearch,
                cycleSelectedSort,
                toggleCuisineTag: (id: TFilterId) => toggleTag(id, setCuisineTags),
                toggleSpecificationTag: (id: TFilterId) => toggleTag(id, setSpecificationTags),
                searchResults,
            }}>
            {children}
        </FilterContext.Provider>
    );
};
