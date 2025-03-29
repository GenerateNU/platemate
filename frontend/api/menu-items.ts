import { TMenuItem } from "@/types/menu-item";
import { makeRequest } from "@/api/base";

export const getMenuItems = async (page: number = 1, limit: number = 25): Promise<TMenuItem[]> => {
    return await makeRequest(`/api/v1/menu-items?page=${page}&limit=${limit}`, "GET");
};
