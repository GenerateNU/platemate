export type Review = {
    id: string;
    plateName: string;
    restaurantName: string;
    tags: string[];
    rating: {
        overall: number,
        portion: number,
        return: boolean,
        taste: number,
        value: number,
    }, 
    content: string;
};