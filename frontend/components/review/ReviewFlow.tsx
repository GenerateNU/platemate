import React, { useState } from "react";
import { Modal } from "react-native";
import { MyReview } from "@/components/MyReview";
import { ReviewIntro } from "./ReviewIntro";
import { ReviewOutro } from "./ReviewOutro";

interface ReviewFlowProps {
    isVisible: boolean;
    onClose: () => void;
    restaurantId: string;
    menuItemName: string;
    menuItemId: string;
    dishImageUrl?: string;
}

export function ReviewFlow({
    isVisible,
    onClose,
    restaurantId,
    menuItemName,
    menuItemId,
    dishImageUrl,
}: ReviewFlowProps) {
    const [step, setStep] = useState(0);

    const handleStartReview = () => {
        setStep(1);
    };

    const handleBackToIntro = () => {
        setStep(0);
    };

    const handleReviewSubmit = () => {
        setStep(2);
    };

    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            {step === 0 ? (
                <ReviewIntro menuItemName={menuItemName} onStart={handleStartReview} onBack={onClose} />
            ) : step === 1 ? (
                <MyReview
                    restaurantId={restaurantId}
                    menuItemName={menuItemName}
                    menuItemId={menuItemId}
                    dishImageUrl={dishImageUrl}
                    onClose={handleBackToIntro}
                    onSubmit={handleReviewSubmit}
                />
            ) : (
                <ReviewOutro onDone={onClose} />
            )}
        </Modal>
    );
}

export default ReviewFlow;
