import { ThemedText } from "@/components/themed/ThemedText";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
    tabs: string[];
    activeTab: number;
    setActiveTab: (index: number) => void;
    callback?: () => void;
};

export default function FeedTabs({ tabs, activeTab, setActiveTab, callback }: Props) {
    return (
        <View style={styles.container}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.tab}
                    onPress={() => {
                        setActiveTab(index);
                        if (callback) {
                            callback();
                        }
                    }}>
                    <ThemedText
                        key={index}
                        type="default"
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
        borderBottomColor: "black",
        borderBottomWidth: 2,
    },
    inactiveTabText: {
        fontWeight: "500",
        color: "#727272",
    },
    tabText: {
        textAlign: "center",
        paddingBottom: 8,
    },
});
