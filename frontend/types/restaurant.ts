export type TRestaurant = {
    name: string;
    address: {
        street: string;
        zipcode: number;
        state: string;
        city: string;
        location: {
            0: number;
            1: number;
        };
    };
    menuItems: string[];
    ratingAvg: {
        overall: number;
        return: number;
    };
    style: string[];
    picture: string;
    description: string;
    tags: string[];
};
