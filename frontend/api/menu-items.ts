import { TMenuItem } from "@/types/menu-item";
import { makeRequest } from "@/api/base";

export const getMenuItems = async (page: number = 1, limit: number = 25): Promise<TMenuItem[]> => {
    return await makeRequest(`/api/v1/menu-items/random?limit=${limit}`, "GET");
};

export const getMenuItemById = async (id: string): Promise<TMenuItem> => {
    return await makeRequest(`/api/v1/menu-items/${id}`, "GET");
};
