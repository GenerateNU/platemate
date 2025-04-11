import React, { useState } from "react";
import { Modal } from "react-native";
import { MyReview } from "@/components/MyReview";
import { ReviewIntro } from "./ReviewIntro";

interface ReviewFlowProps {
    isVisible: boolean;
    onClose: () => void;
    restaurantId: string;
    menuItemName: string;
    dishImageUrl?: string;
}

export function ReviewFlow({ isVisible, onClose, restaurantId, menuItemName, dishImageUrl }: ReviewFlowProps) {
    const [step, setStep] = useState(0);

    const handleStartReview = () => {
        setStep(1);
    };

    const handleBackToIntro = () => {
        setStep(0);
    };

    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            {step === 0 ? (
                <ReviewIntro menuItemName={menuItemName} onStart={handleStartReview} onBack={onClose} />
            ) : (
                <MyReview
                    restaurantId={restaurantId}
                    menuItemName={menuItemName}
                    dishImageUrl={dishImageUrl}
                    onClose={handleBackToIntro}
                />
            )}
        </Modal>
    );
}

export default ReviewFlow;
