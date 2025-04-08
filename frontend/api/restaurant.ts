import { TRestaurant } from "@/types/restaurant";
import { makeRequest } from "@/api/base";

export const getRestaurant = async (id: string): Promise<TRestaurant> => {
    const res = makeRequest("/api/v1/restaurant/" + id, "GET");
    return res;
};
