import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";

const OutroSvg = `
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="100" height="100" rx="50" fill="#FFCF0F"/>
<path d="M43.5999 57.8001L35.1999 49.4001L32.3999 52.2001L43.5999 63.4001L67.5999 39.4001L64.7999 36.6001L43.5999 57.8001Z" fill="black"/>
</svg>
`;

interface ReviewOutroProps {
    onDone: () => void;
}

export function ReviewOutro({ onDone }: ReviewOutroProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <SvgXml xml={OutroSvg} width="100" height="100" />
                <Text style={styles.title}>You're all Set!</Text>
                <Text style={styles.subtitle}>We appreciate your review!</Text>
                <TouchableOpacity style={styles.doneButton} onPress={onDone}>
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 8,
        marginTop: 18,
        textAlign: "center",
        fontFamily: "Nunito",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 24,
        textAlign: "center",
        fontFamily: "Nunito",
    },
    doneButton: {
        backgroundColor: "#FFCF0F",
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 68,
        marginTop: 100,
        alignItems: "center",
    },
    doneButtonText: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Nunito",
    },
});

export default ReviewOutro;
