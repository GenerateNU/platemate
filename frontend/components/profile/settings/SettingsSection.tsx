import React from "react";
import { StyleSheet, Text, View } from "react-native";

type SettingsSectionProps = {
    title: string;
    children: React.ReactNode;
};

const SettingsSection = ({ title, children }: SettingsSectionProps) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 16,
        fontFamily: "Outfit",
        color: "#151619",
    },
    sectionContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
});

export default SettingsSection;
