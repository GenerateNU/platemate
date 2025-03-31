import { SmileyIcon } from "@/components/icons/Icons";
import { View, Text, StyleSheet } from "react-native";

const HighlightCard = ({
    icon = <SmileyIcon />,
    title = "Super Stars",
    subtitle = "200+ Five Stars",
    backgroundColor = "#F7F9FC",
}) => {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.iconContainer}>{icon}</View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        borderRadius: 8,
        width: 120,
        height: 120,
        flex: 1,
    },
    iconContainer: {
        marginBottom: 4,
    },
    textContainer: {
        alignItems: "center",
    },
    title: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#000000",
        textAlign: "center",
        marginBottom: 4,
        fontFamily: "Source Sans 3",
    },
    subtitle: {
        fontSize: 12,
        color: "#666666",
        textAlign: "center",
        fontFamily: "Source Sans 3",
    },
});

export default HighlightCard;
