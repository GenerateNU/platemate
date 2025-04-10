import { TReview } from "@/types/review";
import { makeRequest } from "@/api/base";

export const getReviews = async (page: number = 1, limit: number = 20): Promise<any> => {
    return await makeRequest(`/api/v1/review?page=${page}&limit=${limit}`, "GET");
};

export const getReviewById = async (id: string, userId: string): Promise<TReview> => {
    return await makeRequest(`/api/v1/review/${id}?userId=${userId}`, "GET");
};

export const getFriendsReviews = async (id: string): Promise<TReview[]> => {
    return await makeRequest(`/api/v1/item/${id}/followingReviews`, "GET");
};
