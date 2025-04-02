export type TReview = {
    _id: string;
    rating: {
        portion: number;
        taste: number;
        value: number;
        overall: number;
        return: boolean;
    };
    picture: string;
    content: string;
    reviewer: {
        id: string;
        pfp: string;
        username: string;
    };
    timestamp: any;
    comments: any[];
    menuItem: string;
    restaurantId: string;
    data: {
        id: string;
        rating: {
            portion: number;
            taste: number;
            value: number;
            overall: number;
            return: boolean;
        };
        picture: string;
        content: string;
        reviewer: {
            id: string;
            pfp: string;
            username: string;
        };
        timestamp: any;
        comments: any[];
        menuItem: string;
        restaurantId: string;
    };
};
