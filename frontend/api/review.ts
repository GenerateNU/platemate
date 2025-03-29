import { makeRequest } from "@/api/base";

export interface RatingData {
    taste: number;
    portion: number;
    value: number;
    overall: number;
    return: boolean;
}

export interface ReviewData {
    rating: RatingData;
    picture?: string;
    content: string;
    reviewer: {
        _id: string;
        pfp?: string;
        username: string;
    };
}

export async function createReview(reviewData: ReviewData) {
    return await makeRequest("/api/v1/review", "POST", reviewData, "Failed to create review");
}

export async function getReviewById(reviewId: string) {
    return await makeRequest(`/api/v1/review/${reviewId}`, "GET", null, "Failed to get review");
}

export async function updateReview(reviewId: string, reviewData: ReviewData) {
    return await makeRequest(`/api/v1/review/${reviewId}`, "PUT", reviewData, "Failed to update review");
}
