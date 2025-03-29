import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "@/components/Button";
// import { TFilterId, TFilterItem } from "@/types/filter";
import { TFilterItem } from "@/types/filter";
import { Colors } from "@/constants/Colors";

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
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.black,
    },
    filterHighlightedButton: {
        backgroundColor: Colors.yellow,
        borderColor: Colors.yellow,
    },
    filterUnhighlightedButton: {
        backgroundColor: Colors.white,
        borderColor: Colors.yellow,
    },

    filterText: {
        textAlign: "center",
        color: Colors.black,
        fontFamily: "Poppins",
        fontWeight: "500",
        fontSize: 12,
        lineHeight: 20,
        letterSpacing: 0,
    },
});
