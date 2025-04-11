import React from "react";
import { Modal } from "react-native";
import { MyReview } from "@/components/MyReview";

interface ReviewFlowProps {
    isVisible: boolean;
    onClose: () => void;
    restaurantId: string;
    restaurantName: string;
    menuItemId: string;
    menuItemName: string;
    dishImageUrl?: string;
}

export function ReviewFlow({
    isVisible,
    onClose,
    restaurantId,
    restaurantName,
    menuItemId,
    menuItemName,
    dishImageUrl,
}: ReviewFlowProps) {
    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <MyReview
                restaurantId={restaurantId}
                restaurantName={restaurantName}
                menuItemId={menuItemId}
                menuItemName={menuItemName}
                dishImageUrl={dishImageUrl}
                onClose={onClose}
            />
        </Modal>
    );
}

export default ReviewFlow;
