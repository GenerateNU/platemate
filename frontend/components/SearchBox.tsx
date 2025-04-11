import React, { useEffect, useRef, useState } from "react";
import { TextInput, TextInputProps, StyleSheet, View, Dimensions } from "react-native";
import { ThemedText } from "./themed/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FilterIcon } from "@/components/icons/Icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import FontAwesome5 from "@expo/vector-icons/build/FontAwesome5";

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
    const [recentItems, setRecentItems] = useState<string[]>([]);
    const [showRecents, setShowRecents] = useState(false);
    const router = useRouter();
    const { getRecents, appendSearch } = useRecentSearch(name);
    const [inputHeight, setInputHeight] = useState(0);

    async function fetchRecents() {
        console.log("fetching recents");
        if (recent) {
            setRecentItems(await getRecents());
            setShowRecents(true);
        } else setRecentItems([]);
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
        if (recent) {
            fetchRecents();
        }
    }, [recent]);

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
                    onFocus={() => fetchRecents()}
                    onBlur={() => clearRecents()}
                    onChangeText={onChangeText}
                    {...rest}
                    style={{ ...styles.input, color: textColor, fontWeight: 500, fontFamily: "Nunito" }}
                />
                {icon && icon}
                {filter && (
                    <TouchableOpacity containerStyle={styles.icon} onPress={navigateToFilterTab}>
                        <FilterIcon />
                    </TouchableOpacity>
                )}
            </View>
            {recent && showRecents && (
                <View style={{ ...styles.recentsContainer, top: inputHeight + 8 }}>
                    {recentItems.map((term: string, index: number) => {
                        return (
                            <TouchableOpacity
                                key={index + term}
                                containerStyle={styles.recent}
                                onPress={() => {
                                    console.log("Before updating state:", value); // Log before updating
                                    onChangeText(term);
                                    onSubmit();
                                    appendSearch(term);
                                    setShowRecents(false);
                                    console.log("After updating state:", value); // Log before updating
                                    inputRef.current?.blur();
                                }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <FontAwesome5 name="redo" size={12} color="gray" />
                                    <ThemedText style={{ fontFamily: "Source Sans 3" }}>{term}</ThemedText>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
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
        fontFamily: "Nunito",
    },
    recent: {
        width: "100%",
        padding: 16,
        paddingVertical: 12,
        backgroundColor: "#ffffff50",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        fontFamily: "Nunito",
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontFamily: "Nunito",
    },
    input: {
        flex: 1,
        fontFamily: "Nunito",
    },
    icon: {
        marginLeft: 8,
        resizeMode: "contain",
    },
});
