import { TMenuItem } from "@/types/menu-item";
import { makeRequest } from "@/api/base";
import { TRestaurantMenuItemsMetrics } from "@/types/restaurant";

interface ReviewQueryParams {
    userID?: string;
    sortBy?: "portion" | "taste" | "value" | "overall" | "timestamp";
}

export const getMenuItems = async ({
    name,
    tags,
    page = 1,
    limit = 25,
    sortBy,
    sortOrder,
}: {
    name?: string;
    tags?: string[];
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
}): Promise<TMenuItem[]> => {
    const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    // Conditionally append optional params if provided
    if (name) queryParams.append("name", name);
    if (tags && tags.length > 0) queryParams.append("tags", tags.join(","));
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (sortOrder) queryParams.append("sortOrder", sortOrder);

    return await makeRequest(`/api/v1/menu-items?${queryParams.toString()}`, "GET");
};

export const getMenuItemById = async (id: string): Promise<TMenuItem> => {
    return await makeRequest(`/api/v1/menu-items/${id}`, "GET");
};

export const getRestaurantMenuItemsMetrics = async (restaurantId: string): Promise<TRestaurantMenuItemsMetrics> => {
    return await makeRequest(`/api/v1/menu-items/restaurant/${restaurantId}/metrics`, "GET");
};

export const getRandomMenuItems = async (limit: number): Promise<TMenuItem[]> => {
    return await makeRequest(`/api/v1/menu-items/random?limit=${limit}`, "GET");
};

export const getMenuItemReviews = async (menuItemId: string, params?: ReviewQueryParams) => {
    const queryParams = new URLSearchParams();
    if (params?.userID) {
        queryParams.append("userID", params.userID);
    }
    if (params?.sortBy) {
        queryParams.append("sortBy", params.sortBy);
    }

    const queryString = queryParams.toString();
    const path = `/api/v1/menu-items/${menuItemId}/reviews${queryString ? `?${queryString}` : ""}`;

    return await makeRequest(path, "GET");
};
