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
    restaurantID: string;
    restaurantName: string;
};

export type TMenuItemMetrics = {
    id: string;
    name: string;
    overall_rating: number;
    taste_rating: number;
    portion_rating: number;
    value_rating: number;
    return_rate: number;
    review_count: number;
    popular_tags: string[];
    dietary_restrictions: string[];
};