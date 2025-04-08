import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";

const AddReviewButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <ThemedText style={styles.buttonText}>Add your review!</ThemedText>
        </TouchableOpacity>
    );
};

export default AddReviewButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#FFCF0F",
        padding: 12,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    buttonText: {
        fontFamily: "Nunito",
        fontWeight: "bold",
        fontSize: 16,
    },
});
