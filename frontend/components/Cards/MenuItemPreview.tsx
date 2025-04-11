import { Dimensions, Image, Text, View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { ThemedText } from "../themed/ThemedText";
import Entypo from "@expo/vector-icons/build/Entypo";
import { TrendingIcon } from "@/components/icons/Icons";
import { router, useRouter } from "expo-router";

type Props = {
    plateName: string;
    id: string;
    restaurantName: string;
    tags: string[];
    rating: number;
    content: string;
    trending?: boolean;
    picture: string;
};

const MenuItemPreview = ({ plateName, restaurantName, tags, rating, content, picture, trending, id }: Props) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => {
                router.push(`/(menuItem)/${id}`);
                console.log("Pressed!");
            }}
            style={{
                flex: 1,
                flexDirection: "row",
                width: Dimensions.get("window").width * 0.8,
                justifyContent: "space-between",
                alignItems: "center",
            }}>
            <View style={{ gap: 0, width: "70%" }}>
                {trending && (
                    <TrendingIcon
                        fill={trending ? "#0a7ea4" : "#000"}
                        height={Dimensions.get("window").width * 0.07}
                        width={Dimensions.get("window").width * 0.3}
                    />
                )}
                <View style={{ gap: 10, padding: 16, flexDirection: "column", width: "100%", marginTop: 0 }}>
                    <View>
                        <ThemedText type="subtitle">{plateName}</ThemedText>
                        <ThemedText
                            type="default"
                            style={{
                                width: "100%",
                                fontFamily: "Source Sans 3",
                                lineHeight: 20,
                            }}>
                            {content}
                        </ThemedText>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexDirection: "row", gap: 12 }}>
                        {tags.map((tag: string, index: number) => (
                            <Text
                                key={index}
                                style={{
                                    backgroundColor: "#fc0",
                                    color: "#000",
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    borderRadius: 20,
                                    fontSize: 14,
                                    fontFamily: "Source Sans 3",
                                }}>
                                {tag}
                            </Text>
                        ))}
                    </ScrollView>

                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <ThemedText type="default">Overall Rating: {rating}</ThemedText>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Entypo name="location-pin" size={24} color="black" />
                        <ThemedText type="default" numberOfLines={1} style={{ fontFamily: "Source Sans 3" }}>
                            {restaurantName}
                        </ThemedText>
                    </View>
                </View>
            </View>
            <Image
                source={{ uri: picture }}
                style={{
                    width: Dimensions.get("window").width * 0.5,
                    height: Dimensions.get("window").width * 0.5,
                    borderRadius: 3000,
                }}
            />
        </TouchableOpacity>
    );
};

export default MenuItemPreview;
