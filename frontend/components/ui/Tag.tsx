import { StyleSheet, Text } from "react-native";

type TagProps = {
    text: string;
    color?: string;
};

const Tag = ({ text, color = "#fc0" }: TagProps) => {
    return <Text style={[styles.tag, { backgroundColor: color }]}>{text}</Text>;
};

const styles = StyleSheet.create({
    tag: {
        color: "#000",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 12,
        fontFamily: "Nunito",
        fontWeight: "semibold",
        marginRight: 0,
    },
});

export default Tag;
