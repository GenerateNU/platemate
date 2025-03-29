import React from "react";
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from "react-native";
// import { useThemeColor } from "@/hooks/useThemeColor"; // Adjust import path as needed

export function ThemedTouchable({ style, children, ...rest }: TouchableOpacityProps) {
    return (
        <TouchableOpacity style={[styles.container, style]} {...rest}>
            {children}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 40,
        borderWidth: 1,
        backgroundColor: "#ffffff",
        borderColor: "#DDD",
    },
});
