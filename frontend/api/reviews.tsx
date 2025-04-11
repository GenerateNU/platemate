import { TReview } from "@/types/review";
import { makeRequest } from "@/api/base";

export const getReviews = async (page: number = 1, limit: number = 20): Promise<any> => {
    return await makeRequest(`/api/v1/review?page=${page}&limit=${limit}`, "GET");
};

export const getReviewById = async (id: string): Promise<TReview> => {
    return await makeRequest(`/api/v1/review/${id}`, "GET");
};

export const getFriendsReviews = async (id: string): Promise<TReview[]> => {
    return await makeRequest(`/api/v1/reviews/${id}/friendReviews`, "GET");
};

export const getUserReviews = async (userId: string): Promise<TReview[]> => {
    return await makeRequest(`/api/v1/review/user/${userId}`, "GET");
};

export const getRestaurantReviews = async (restaurantId: string): Promise<TReview[]> => {
    console.log("bang 3");
    return await makeRequest(`/api/v1/review/${restaurantId}/reviews`, "GET");
};

export const getRestaurantReviewsByUser = async (userId: string, restaurantId: string): Promise<TReview[]> => {
    console.log("bang 4");
    return await makeRequest(`/api/v1/review/${restaurantId}/user/${userId}/reviews`, "GET");
};
