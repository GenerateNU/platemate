import React from "react";
// import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { StyleSheet, ScrollView, Dimensions, Modal } from "react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { MyReview } from "@/components/MyReview";

interface ReviewFlowProps {
    isVisible: boolean;
    onClose: () => void;
    restaurantId: string;
    menuItemName: string;
    dishImageUrl?: string;
}

export function ReviewFlow({ isVisible, onClose, restaurantId, menuItemName, dishImageUrl }: ReviewFlowProps) {
    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
            <MyReview
                restaurantId={restaurantId}
                menuItemName={menuItemName}
                dishImageUrl={dishImageUrl}
                onClose={onClose}
            />
        </Modal>
    );
}

// const ReviewFlow = () => {
//     return (
//         <ThemedView style={styles.container}>
//             <ThemedText type="title" style={styles.title}>
//                 Review Flow
//             </ThemedText>
//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 <MyReview />
//             </ScrollView>
//         </ThemedView>
//     );
// };

export default ReviewFlow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: Dimensions.get("window").height * 0.12,
        gap: 16,
    },
    title: {
        fontWeight: "700",
    },
    scrollContainer: {
        gap: 16,
    },
});
