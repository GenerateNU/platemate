import { TRestaurant } from "@/types/restaurant";
import { FriendsFavInfo } from "@/types/restaurant";
import { makeRequest } from "@/api/base";

export const getRestaurant = async (id: string): Promise<TRestaurant> => {
    return await makeRequest(`/api/v1/restaurant/${id}`, "GET");
};

export const getRestaurantFriendsFav = async (userId: string, restaurantId: string): Promise<FriendsFavInfo> => {
    const data = await makeRequest(`/api/v1/restaurant/${userId}/${restaurantId}`, "GET");
    const formattedFriendsFav: FriendsFavInfo = {
                    isFriendsFav: data.friends_fav,
                    numFriends: data.friends_reviewed
    };
    return formattedFriendsFav;
}

export const getRestaurantSuperStars = async (restaurantId: string): Promise<number> => {
    return await makeRequest(`/api/v1/restaurant/${restaurantId}/super-stars`, "GET");
}