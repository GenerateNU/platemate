import { Dimensions, Image, Text, View, ScrollView } from "react-native";
import React from "react";
import { ThemedText } from "../ThemedText";
import Entypo from "@expo/vector-icons/build/Entypo";
import { TrendingIcon } from "@/components/icons/Icons";

type Props = {
    plateName: string;
    restaurantName: string;
    tags: string[];
    rating: number;
    content: string;
    trending?: boolean;
    picture: string;
};

const MenuItemPreview = ({ plateName, restaurantName, tags, rating, content, picture, trending }: Props) => {
    return (
        <View
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
                                fontFamily: "Outfit",
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
                                    fontFamily: "Outfit",
                                }}>
                                {tag}
                            </Text>
                        ))}
                    </ScrollView>

                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <ThemedText type="default">Overall Rating {rating}</ThemedText>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Entypo name="location-pin" size={24} color="black" />
                        <ThemedText type="default" style={{ fontFamily: "Outfit" }}>
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
        </View>
    );
};

export default MenuItemPreview;
