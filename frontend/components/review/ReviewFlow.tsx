import React from "react";
import { Modal } from "react-native";
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

export default ReviewFlow;
