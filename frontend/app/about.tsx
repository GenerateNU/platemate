import { Button, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { useRegister } from "@/hooks/useRegister";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/hooks/useAuth";

export default function AboutScreen() {
    return (
        <ThemedView style={styles.textContainer}>
            <ThemedText type="default" style={{ fontFamily: "Outfit" }}>
                This text serves as the body content of the example stack.
            </ThemedText>

            <Button
                title="Click Me"
                onPress={() => {
                    //useRegister("stinky", "fart");
                    useLogin("stinky", "fart");
                    useAuth().then((value) => console.log(value));
                    console.log("Button pressed!");
                }}
            />
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
