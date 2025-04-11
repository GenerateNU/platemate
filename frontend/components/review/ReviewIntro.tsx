import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { IconSymbol } from "@/components/ui/IconSymbol";

const shareReviewSvg = `
<svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="110" height="110" rx="55" fill="#FFCF0F"/>
<path d="M77.6667 30.1667H32.3334C29.2167 30.1667 26.6951 32.7167 26.6951 35.8334L26.6667 86.8334L38.0001 75.5001H77.6667C80.7834 75.5001 83.3334 72.9501 83.3334 69.8334V35.8334C83.3334 32.7167 80.7834 30.1667 77.6667 30.1667ZM77.6667 69.8334H35.6484L32.3334 73.1484V35.8334H77.6667V69.8334ZM50.7501 64.1667H72.0001V58.5001H56.4167L50.7501 64.1667ZM61.6867 47.5351C62.2534 46.9684 62.2534 46.0901 61.6867 45.5234L56.6717 40.5084C56.1051 39.9417 55.2267 39.9417 54.6601 40.5084L38.0001 57.1684V64.1667H44.9984L61.6867 47.5351Z" fill="white"/>
</svg>
`;

interface ReviewIntroProps {
    menuItemName: string;
    onStart: () => void;
    onBack: () => void;
}

export function ReviewIntro({ menuItemName, onStart, onBack }: ReviewIntroProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <IconSymbol name="chevron.left" color="#000" size={24} />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <SvgXml xml={shareReviewSvg} width="110" height="110" />
                <Text style={styles.title}>Share Your Review</Text>
                <Text style={styles.subtitle}>Share your thoughts on {menuItemName}!</Text>
                <TouchableOpacity style={styles.startButton} onPress={onStart}>
                    <Text style={styles.startButtonText}>Start your review</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    backButton: {
        padding: 8,
    },
    content: {
        flex: 1,
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
        fontSize: 18,
        color: "#666",
        marginBottom: 24,
        textAlign: "center",
        fontFamily: "Nunito",
    },
    startButton: {
        backgroundColor: "#FFCF0F",
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 68,
        marginTop: 100,
        alignItems: "center",
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Nunito",
    },
});

export default ReviewIntro;
