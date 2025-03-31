export type TMenuItem = {
    id: string;
    name: string;
    picture: string;
    avgRating: {
        portion: number;
        taste: number;
        value: number;
        overall: number;
        return: number;
    };
    reviews: string[];
    description: string;
    location: {
        0: number;
        1: number;
    };
    tags: string[];
    dietaryRestrictions: string[];
    restaurantId: string;
};
