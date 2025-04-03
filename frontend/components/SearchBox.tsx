import React, { useRef } from "react";
import { TextInput, TextInputProps, StyleSheet, View, TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FilterIcon } from "@/components/icons/Icons";
import { useRouter } from "expo-router";

export interface SearchBoxProps extends TextInputProps {
    value: string;
    recent?: boolean;
    name?: string;
    onSubmit: () => void;
    onChangeText: (text: string) => void;
    icon?: React.ReactNode;
    filter?: boolean; // should we include filters
}

export function SearchBox({ value, onChangeText, onSubmit, icon, recent, name, filter, ...rest }: SearchBoxProps) {
    const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
    const inputRef = useRef<TextInput>(null);
    const router = useRouter();

    const onSubmitEditing = () => {
        onSubmit();
    };

    const navigateToFilterTab = () => {
        if (filter) {
            router.push(`/filter`); // TODO: make it take in anythign Navigate to the specified filter tab
        }
    };

    return (
        <View>
            <View style={styles.container}>
                <TextInput
                    id={"search-input"}
                    ref={inputRef}
                    onSubmitEditing={onSubmitEditing}
                    placeholderTextColor={"gray"}
                    value={value}
                    onChangeText={onChangeText}
                    {...rest}
                    style={{ ...styles.input, color: textColor, fontWeight: 500, fontFamily: "Source Sans 3" }}
                />
                {icon && icon}
                {filter && (
                    <TouchableOpacity style={styles.icon} onPress={navigateToFilterTab}>
                        <FilterIcon />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    recentsContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        position: "absolute",
        backgroundColor: "#ffffff",
        zIndex: 10,
        paddingBottom: 8,
        width: "100%",
        fontFamily: "Source Sans 3",
    },
    recent: {
        width: "100%",
        padding: 16,
        paddingVertical: 6,
        backgroundColor: "#ffffff50",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        fontFamily: "Source Sans 3",
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#DDD",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
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
});
