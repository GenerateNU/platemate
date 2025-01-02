import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function AboutScreen() {
    return (
        <ThemedView style={styles.textContainer}>
            <ThemedText type="default" style={{ fontFamily: "Outfit" }}>
                This text serves as the body content of the example stack.
            </ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
        alignItems: "center",
        padding: 12,
    },
});
