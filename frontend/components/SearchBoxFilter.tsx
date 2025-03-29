import React, { useEffect, useRef, useState } from "react";
import { TextInput, StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import { ThemedText } from "./themed/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import FontAwesome5 from "@expo/vector-icons/build/FontAwesome5";
import { SearchBoxProps } from "./SearchBox";
import { SortIcon } from "./icons/Icons";

export function SearchBoxFilter({ value, onChangeText, onSubmit, icon, recent, name, ...rest }: SearchBoxProps) {
    const { getRecents, appendSearch } = useRecentSearch(name);
    const [inputHeight, setInputHeight] = useState(0);
    const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
    const inputRef = useRef<TextInput>(null);
    const [recentItems, setRecentItems] = useState<string[]>([]);

    async function fetchRecents() {
        if (recent) setRecentItems(await getRecents());
        else setRecentItems([]);
    }

    async function clearRecents() {
        setRecentItems([]);
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current?.measureInWindow((height) => {
                setInputHeight(height + Dimensions.get("window").height * 0.01);
            });
        }
    }, [inputRef]);

    useEffect(() => {
        fetchRecents();
    }, [recent]);

    const onSubmitEditing = () => {
        if (recent)
            appendSearch(value).then(() => {
                fetchRecents();
            });
        onSubmit();
    };

    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchBoxContainer}>
                <View>
                    <View style={styles.container}>
                        <TextInput
                            id={"search-input"}
                            ref={inputRef}
                            onSubmitEditing={onSubmitEditing}
                            onFocus={() => fetchRecents()}
                            onBlur={() => clearRecents()}
                            value={value}
                            onChangeText={onChangeText}
                            {...rest}
                            style={{ ...styles.input, color: textColor }}
                        />
                        {icon && icon}
                    </View>
                    {recent && (
                        <View style={{ ...styles.recentsContainer, top: inputHeight }}>
                            {recentItems.map((term: string, index: number) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.recent}
                                        onPress={() => {
                                            inputRef.current?.blur();
                                            onChangeText(term);
                                            onSubmit();
                                            appendSearch(term);
                                        }}>
                                        <FontAwesome5 name="redo" size={12} color="gray" />
                                        <ThemedText style={{ fontFamily: "Source Sans 3" }}>{term}</ThemedText>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
            <SortIcon width={20} height={30} />
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
        borderWidth: 1,
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
