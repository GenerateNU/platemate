import { makeRequest } from "@/api/base";
import { TReview } from "@/types/review";

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

export async function getReviewById(reviewId: string): Promise<TReview> {
    return await makeRequest(`/api/v1/review/${reviewId}`, "GET", null, "Failed to get review");
}

export async function updateReview(reviewId: string, reviewData: ReviewData) {
    return await makeRequest(`/api/v1/review/${reviewId}`, "PUT", reviewData, "Failed to update review");
}

// @TODO - type this properly
export async function getLikers(reviewId: string): Promise<any[]> {
    return await makeRequest(`/api/v1/review/${reviewId}/like`, "GET", null, "Failed to get likers");
}

export async function vote(reviewId: string, userId: string, type: number): Promise<string> {
    return await makeRequest(
        `/api/v1/review/${reviewId}/vote`,
        "POST",
        {
            like: type,
            userId: userId,
        },
        "Failed to vote",
    );
}
