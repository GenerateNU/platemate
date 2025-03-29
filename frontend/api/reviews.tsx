import { TReview } from "@/types/review";
import { makeRequest } from "@/api/base";

export const getReviews = async (page: number = 1, limit: number = 20): Promise<any> => {
    const response = await makeRequest(`/api/v1/review?page=${page}&limit=${limit}`, "GET");
    return response;
};

export const getReviewById = async (id: string): Promise<TReview> => {
    return await makeRequest(`/api/v1/review/${id}`, "GET");
};
