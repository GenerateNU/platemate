import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type SettingsMenuItemProps = {
    label: string;
    onPress: () => void;
    showChevron?: boolean;
};

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ label, onPress, showChevron = false }) => {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <Text style={styles.menuItemText}>{label}</Text>
            {showChevron && <Text style={styles.chevron}>›</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#151619",
        fontFamily: "Outfit",
    },
    chevron: {
        fontSize: 20,
        color: "#727272",
    },
});

export default SettingsMenuItem;
