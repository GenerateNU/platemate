import { TMenuItem } from "@/types/menu-item";
import { makeRequest } from "@/api/base";
import { TRestaurantMenuItemsMetrics } from "@/types/restaurant";

export const getMenuItems = async (page: number = 1, limit: number = 25): Promise<TMenuItem[]> => {
    return await makeRequest(`/api/v1/menu-items?page=${page}&limit=${limit}`, "GET");
};

export const getRestaurantMenuItemsMetrics = async (restaurantId: string): Promise<TRestaurantMenuItemsMetrics> => {
    return await makeRequest(`/api/v1/menu-items/restaurant/${restaurantId}/metrics`, "GET");
};