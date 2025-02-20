import { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
    tabs: string[];
    activeTab: number;
    setActiveTab: (index: number) => void;
};

export default function FeedTabs({ tabs, activeTab, setActiveTab }: Props) {
    return (
        <View style={styles.container}>
            {tabs.map((tab, index) => (
                <TouchableOpacity key={index} style={styles.tab} onPress={() => setActiveTab(index)}>
                    <ThemedText
                        key={index}
                        type="title"
                        style={[styles.tabText, activeTab === index ? styles.activeTabText : styles.inactiveTabText]}>
                        {tab}
                    </ThemedText>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    tabContainer: {},
    tab: {
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
        paddingBottom: 4,
    },
    activeTabText: {
        fontWeight: "600",
        textDecorationStyle: "solid",
        borderBottomColor: "#0a7ea4",
        borderBottomWidth: 2,
    },
    inactiveTabText: {
        fontWeight: "500",
        color: "#727272",
    },
    tabText: {
        fontSize: 16,
        fontFamily: "Outfit",
        textAlign: "center",
    },
});
