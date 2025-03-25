import { ScrollView } from "react-native";

import React, { useState } from "react";
import RestaurantView from "@/app/RestaurantView";
import MenuItemView from "../MenuItemView";
import { Button } from "@/components/Button";
import ReviewDetail from "@/components/review/ReviewDetail";
import { ThemedView } from "@/components/themed/ThemedView";
import AllReviews from "@/components/review/AllReviews";
export default function ExploreScreen() {
    const [showMenuItemView, setShowMenuItemView] = useState(false);
    const [showReviewDetail, setShowReviewDetail] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    return (
        <>
            {showMenuItemView && <MenuItemView />}
            {showReviewDetail && <ReviewDetail />}
            {showAllReviews && <AllReviews />}
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
            </ThemedView>
        </>
    );
    // return <RestaurantView />;
}
