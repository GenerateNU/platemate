import { useRecentSearch } from "../hooks/useRecentSearch";
import React, { useEffect, useRef } from "react";
import { TextInput, TextInputProps, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface SearchBoxProps extends TextInputProps {
    value: string;
    recent?: boolean;
    name?: string;
    onSubmit: () => void;
    onChangeText: (text: string) => void;
    icon?: React.ReactNode;
}

export function SearchBox({ value, onChangeText, onSubmit, icon, recent, name, ...rest }: SearchBoxProps) {
    const { getRecents, appendSearch } = useRecentSearch(name);
    let recents: any = useRef([]); // TODO: fix this type
    useEffect(() => {
        if (recent) recents.current = getRecents();
    }, [recent, getRecents]);

    const onSubmitEditing = () => {
        if (recent) appendSearch(value);
        onSubmit();
    };

    return (
        <View>
            <View style={styles.container}>
                <TextInput
                    onSubmitEditing={onSubmitEditing}
                    value={value}
                    onChangeText={onChangeText}
                    {...rest}
                    style={styles.input}
                />
                {icon && icon}
            </View>
            {recent && (
                <View style={styles.recentsContainer}>
                    {recents.current.map((term: string, index: number) => {
                        return (
                            <View key={index} style={styles.recent}>
                                <ThemedText>{term}</ThemedText>
                            </View>
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
        marginTop: 8,
        position: "absolute",
    },
    recent: {
        width: "100%",
        paddingVertical: 4,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
    },
    icon: {
        marginLeft: 8,
        resizeMode: "contain",
    },
});
