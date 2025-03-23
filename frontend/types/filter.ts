type FilterKey = 
    | "Fast Food"
    | "Pizza"
    | "Chinese"
    | "Sushi"
    | "Mexico"
    | "Indian"
    | "Burgers"
    | "Wings"
    | "Thai"
    | "Coffee"
    | "Bubble Tea"
    | "Korean"
    | "Halal"
    | "Vietnamese"
    | "Hot Pot"
    | "Greek"
    | "Ice cream"
    | "BBQ"
    | "Italian"
    | "Asian"
    | "Seafood"
    | "Soup"
    | "Japanese"
    | "Salad"
    | "American"
    | "Comfort food"
    | "Breakfast"
    | "Caribbean"
    | "Bakery"
    | "Bar";

type FilterItem = {
    id: FilterKey;
    selected: boolean;
};

type SpecificationKey =
    | "Vegan"
    | "Healthy"
    | "Small-Business"
    | "Trending"
    | "Low-Cal"
    | "Sit-Down"
    | "To-Go"
    | "BYOB"
    | "Delivery-Available"
    | "Reservation-Required";

type SpecificationItem = {
    id: SpecificationKey;
    selected: boolean;
};

export type TSortOptionKey = "Taste Rating" | "Value Rating" | "Portion Rating" | "Overall Rating";

export type TSortOption = {
    id: TSortOptionKey;
    direction: "none" | "up" | "down";
};

