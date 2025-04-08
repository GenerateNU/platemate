import React, { useState } from "react";
import RestaurantView from "@/app/RestaurantView";
import MenuItemView from "../MenuItemView";
import { Button } from "@/components/Button";
import ReviewDetail from "@/components/review/ReviewDetail";
import { ThemedView } from "@/components/themed/ThemedView";
import AllReviews from "@/components/review/AllReviews";
import { MyReview } from "@/components/MyReview";

export default function ExploreScreen() {
    const [showMenuItemView, setShowMenuItemView] = useState(false);
    const [showReviewDetail, setShowReviewDetail] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [showMyReview, setShowMyReview] = useState(false);
    const [showRestaurantView, setShowRestaurantView] = useState(false);

    return (
        <>
            {showMenuItemView && <MenuItemView />}
            {showReviewDetail && <ReviewDetail />}
            {showAllReviews && <AllReviews />}
            {showMyReview && <MyReview />}
            {showRestaurantView && <RestaurantView />}

            <ThemedView style={{ flex: 1, padding: 24, gap: 16 }}>
                <Button
                    title="Show Menu Item View"
                    onPress={() => {
                        setShowMenuItemView(true);
                    }}
                />
                <Button
                    title="Show Review Detail"
                    onPress={() => {
                        setShowReviewDetail(true);
                    }}
                />
                <Button
                    title="Show All Reviews"
                    onPress={() => {
                        setShowAllReviews(true);
                    }}
                />
                <Button
                    title="Show Review Flow"
                    onPress={() => {
                        setShowMyReview(true);
                    }}
                />
                <Button
                    title="Show Restaurant View"
                    onPress={() => {
                        setShowRestaurantView(true);
                    }}
                />
            </ThemedView>
        </>
    );
}
