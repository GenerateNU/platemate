import React from "react";
import { TextInput, TextInputProps, StyleSheet, View } from "react-native";

interface SearchBoxProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    icon?: React.ReactNode;
}

export function SearchBox({ value, onChangeText, icon, ...rest }: SearchBoxProps) {
    return (
        <View style={styles.container}>
            <TextInput value={value} onChangeText={onChangeText} {...rest} style={styles.input} />
            {icon && icon}
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
