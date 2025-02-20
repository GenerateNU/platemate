import { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TouchableOpacity } from "react-native";

type Props = {
    tabs: string[];
};

export default function FeedTabs({ tabs }: Props) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <ThemedView style={styles.container}>
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
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
    },
    tabContainer: {},
    tab: {
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    activeTabText: {
        fontWeight: "600",
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
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
