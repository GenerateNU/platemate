import { StyleSheet, Text, ScrollView, View } from "react-native";
import React, { useState } from "react";
import MenuItemPreview from "../Cards/MenuItemPreview";
import ReviewPreview from "../Cards/ReviewPreview";
import { ThemedText } from "../ThemedText";

type Props = {
    activeTab: number;
};

const FRIENDS = 0;
const RECOMMENDED = 1;

const FeedContent = ({ activeTab }: Props) => {
    const [recommended, setReccomended] = useState([
        {
            plateName: "Chipotle Burrito",
            restaurantName: "Chipotle",
            tags: ["tag1", "tag2", "tag3", "tag4"],
            rating: 4.5,
            content: "This is the content of the review.",
            trending: true,
            picture:
                "https://static01.nyt.com/images/2024/01/10/multimedia/AS-Burrito-vzhk/AS-Burrito-vzhk-threeByTwoMediumAt2X.jpg",
        },
        {
            plateName: "Quarter Pounder Cheese Deluxe",
            restaurantName: "McDonald's",
            tags: ["Healthy", "Value", "Yummy", "tag4"],
            rating: 4.5,
            content: "This is the content of the review.",
            trending: true,
            picture:
                "https://s7d1.scene7.com/is/image/mcdonalds/DC_202309_4282_QuarterPounderCheeseDeluxe_Shredded_1564x1564-1:nutrition-calculator-tile",
        },
        {
            plateName: "Spicy Miso Ramen",
            restaurantName: "Dishingouth",
            tags: ["tag1", "tag2", "tag3", "tag4"],
            rating: 4.5,
            content:
                "Spicy miso ramen is a must-try dish at Dishingouth. The dish is made with a blend of miso paste, soy sauce, and rice vinegar, giving it a unique flavor. ",
            trending: true,
            picture: "https://dishingouthealth.com/wp-content/uploads/2022/01/SpicyMisoRamen_Square.jpg",
        },
        {
            plateName: "Niku Udon",
            restaurantName: "Yume Ga Arukara",
            tags: ["tag1", "tag2", "tag3", "tag4"],
            rating: 5,
            content: "Fresh handpulled udon noodles are served with a spicy sauce and a side of pickled vegetables.",
            trending: true,
            picture:
                "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2024/08/28/FNK_NikuUdon_349_H.jpg.rend.hgtvcom.1280.720.suffix/1725030505255.webp",
        },
        {
            plateName: "Plate 1",
            restaurantName: "Restaurant 1",
            tags: ["tag1", "tag2", "tag3", "tag4"],
            rating: 4.5,
            content: "This is the content of the review.",
            trending: true,
            picture:
                "https://static01.nyt.com/images/2024/01/10/multimedia/AS-Burrito-vzhk/AS-Burrito-vzhk-threeByTwoMediumAt2X.jpg",
        },
    ]);

    const [friends, setFriends] = useState([
        {
            plateName: "Quarter Pounder Cheese Deluxe",
            restaurantName: "McDonald's",
            tags: ["tag1", "tag2", "tag3", "tag4"],
            rating: 4.5,
            content:
                "The moment I ordered this, I was blown away by the flavor. It was like nothing I had ever tasted before.",
        },
        {
            plateName: "Plate 1",
            restaurantName: "Restaurant 1",
            tags: ["tag1", "tag2", "tag3", "tag4"],
            rating: 4.5,
            content: "This is the content of the review.",
        },
        {
            plateName: "Plate 1",
            restaurantName: "Restaurant 1",
            tags: ["tag1", "tag2", "tag3", "tag4"],
            rating: 4.5,
            content: "This is the content of the review.",
        },
    ]);

    if (activeTab === FRIENDS) {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ paddingBottom: 16 }}>
                    <ThemedText type="sectionTitle">Your Friends Say</ThemedText>
                </View>
                <ScrollView horizontal contentContainerStyle={{ gap: 16 }} showsHorizontalScrollIndicator={false}>
                    {friends.map((item: any, index: number) => {
                        return <ReviewPreview key={index} {...item} />;
                    })}
                </ScrollView>

                <View style={{ paddingBottom: 16, paddingTop: 16 }}>
                    <ThemedText type="sectionTitle">Popular With Friends</ThemedText>
                </View>
                <ScrollView contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
                    {recommended.map((item: any, index: number) => {
                        return <MenuItemPreview key={index} {...item} />;
                    })}
                </ScrollView>
            </ScrollView>
        );
    } else if (activeTab === RECOMMENDED) {
        return (
            <ScrollView contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
                {recommended.map((item: any, index: number) => {
                    return <MenuItemPreview key={index} {...item} />;
                })}
            </ScrollView>
        );
    }
};

export default FeedContent;

const styles = StyleSheet.create({});
