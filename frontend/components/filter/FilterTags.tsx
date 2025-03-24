import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import { TFilterId, TFilterItem } from "@/types/filter";

type FilterTagButtonProp = TFilterItem & {
    onPress: () => void;
};

export const FilterTagButton = ({ id: title, onPress, selected = false }: FilterTagButtonProp) => {
    return (
        <Button
            title={title}
            onPress={onPress}
            containerStyle={[
                styles.filterButton,
                selected ? styles.filterHighlightedButton : styles.filterUnhighlightedButton,
            ]}
            textStyle={[styles.filterText]}
        />
    );
};

const styles = StyleSheet.create({
    filterButton: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#000000",
    },
    filterHighlightedButton: {
        backgroundColor: "#FFCF0F",
        borderColor: "#FFCF0F",
    },
    filterUnhighlightedButton: {
        backgroundColor: "#FFFFFF",
        borderColor: "#FFCF0F",
    },

    filterText: {
        textAlign: "center",
        color: "#000000",
        fontFamily: "Poppins",
        fontWeight: "500",
        fontSize: 12,
        lineHeight: 20,
        letterSpacing: 0,
    },
});
