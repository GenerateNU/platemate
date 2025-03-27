import React, { useState } from "react";
import { ScrollView } from "react-native";

import { ThemedView } from "@/components/themed/ThemedView";
import FeedTabs from "@/components/Feed/FeedTabs";
import { RestaurantDetailItem } from "@/components/restaurant/RestaurantDetailItem";

import { StarReview } from "@/components/StarReview";
import ReviewPreview from "@/components/review/ReviewPreview";
import MenuItemPreview from "@/components/Cards/MenuItemPreview";
import MenuItemView from "../MenuItemView";

export default function Feed() {
    const [activeTab, setActiveTab] = React.useState(0);

    const [recommended] = useState([
        {
            plateName: "Spicy Miso Ramen",
            restaurantName: "Dishingouth",
            tags: ["tag1", "tag2", "tag3", "tag4"],
            rating: 4.5,
            content:
                "Spicy miso ramen is a must-try dish at Dishingouth. The dish is made with a blend of miso paste, soy sauce, and rice vinegar.. ",
            trending: true,
            picture: "https://dishingouthealth.com/wp-content/uploads/2022/01/SpicyMisoRamen_Square.jpg",
        },
    ]);

    const [friends] = useState([
        {
            plateName: "Spicy Chicken Sandwich",
            restaurantName: "Chick-fil-A",
            tags: ["spicy", "crispy", "juicy", "flavorful", "fresh", "breaded"],
            rating: 4.8,
            content:
                "Absolutely loved this! The perfect blend of crispiness and spice. The pickles added a great crunch.",
        },
        {
            plateName: "Margherita Pizza",
            restaurantName: "Pizzeria Napoli",
            tags: ["cheesy", "fresh", "thin crust", "wood-fired"],
            rating: 4.7,
            content: "The fresh basil and mozzarella were top-notch. The crust was perfectly crispy but soft inside.",
        },
        {
            plateName: "Sushi Platter",
            restaurantName: "Tokyo Bites",
            tags: ["fresh", "umami", "delicate", "authentic"],
            rating: 4.9,
            content:
                "Melt-in-your-mouth sushi! Every piece had a distinct flavor, and the soy sauce was perfectly balanced.",
        },
        {
            plateName: "BBQ Ribs",
            restaurantName: "Smokey’s Grill",
            tags: ["smoky", "tender", "rich", "saucy"],
            rating: 4.6,
            content: "These ribs were fall-off-the-bone tender. The sauce was tangy and had just the right kick!",
        },
        {
            plateName: "Avocado Toast",
            restaurantName: "Green & Go Café",
            tags: ["healthy", "fresh", "creamy", "light"],
            rating: 4.3,
            content:
                "A great light meal! The avocados were perfectly ripe, and the sourdough added the right amount of crunch.",
        },
        {
            plateName: "Butter Chicken",
            restaurantName: "Tandoori Palace",
            tags: ["creamy", "spiced", "rich", "authentic"],
            rating: 4.8,
            content:
                "One of the best butter chickens I’ve had! The sauce was creamy and full of flavor, best paired with naan.",
        },
        {
            plateName: "Chocolate Lava Cake",
            restaurantName: "Sweet Cravings",
            tags: ["rich", "gooey", "decadent", "warm"],
            rating: 5.0,
            content:
                "Pure indulgence! The molten chocolate inside was heavenly, paired with a scoop of vanilla ice cream.",
        },
        {
            plateName: "Bacon Cheeseburger",
            restaurantName: "Grill Masters",
            tags: ["hearty", "cheesy", "savory", "smoky"],
            rating: 4.5,
            content: "A solid burger with a generous amount of cheese and crispy bacon. The smoky taste was fantastic.",
        },
        {
            plateName: "Pho",
            restaurantName: "Saigon Eats",
            tags: ["brothy", "herbal", "comforting", "authentic"],
            rating: 4.7,
            content:
                "The broth was incredibly flavorful, and the beef was tender. Loved the fresh basil and lime on the side!",
        },
        {
            plateName: "Lobster Roll",
            restaurantName: "The Dockside Diner",
            tags: ["buttery", "fresh", "seafood", "succulent"],
            rating: 4.9,
            content:
                "The lobster was so fresh and buttery, with just the right touch of lemon. Easily one of the best I’ve had.",
        },
    ]);

    return (
        <ScrollView style={{ flex: 1, marginBottom: 84 }}>
            <ThemedView style={{ flex: 1, alignItems: "center", padding: 24, gap: 12 }}>
                <FeedTabs tabs={["Friends", "Recommended"]} activeTab={activeTab} setActiveTab={setActiveTab} />
                <ThemedView style={{ flex: 1, width: "100%", gap: 16 }}>
                    <ScrollView horizontal contentContainerStyle={{ gap: 16 }} showsHorizontalScrollIndicator={false}>
                        {friends.map((item: any, index: number) => {
                            return <ReviewPreview key={index} {...item} />;
                        })}
                    </ScrollView>
                    <ScrollView contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
                        {recommended.map((item: any, index: number) => {
                            return <MenuItemPreview key={index} {...item} />;
                        })}
                    </ScrollView>
                </ThemedView>
            </ThemedView>
        </ScrollView>
    );
}
