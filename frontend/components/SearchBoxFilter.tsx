import React, { useRef } from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SearchBoxProps } from "./SearchBox";
import { SortIcon } from "./icons/Icons";

export function SearchBoxFilter({ value, onChangeText, onSubmit, icon, recent, name, ...rest }: SearchBoxProps) {
    const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
    const inputRef = useRef<TextInput>(null);

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit();
        }
    };

    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchBoxContainer}>
                <View>
                    <View style={styles.container}>
                        <TextInput
                            id={"search-input"}
                            ref={inputRef}
                            onSubmitEditing={handleSubmit}
                            value={value}
                            onChangeText={onChangeText}
                            {...rest}
                            style={{ ...styles.input, color: textColor }}
                        />
                        {icon && icon}
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => {}}>
                <SortIcon width={20} height={30} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontFamily: "Source Sans 3",
    },
    input: {
        flex: 1,
        fontFamily: "Source Sans 3",
    },
    icon: {
        marginLeft: 8,
        resizeMode: "contain",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
    },
    searchBoxContainer: {
        flex: 1,
        marginRight: 10,
    },
});
