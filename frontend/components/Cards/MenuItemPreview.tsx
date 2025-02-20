import { Dimensions, StyleSheet, Image, Text, View } from "react-native";
import React from "react";
import UserInfoRowBase from "../UserInfo/UserInfoRowBase";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import Entypo from "@expo/vector-icons/build/Entypo";
import Trending from "@/assets/images/trending.svg";

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
    const color = useThemeColor({ light: "#000", dark: "#fff" }, "text");
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
                    <Trending
                        fill={trending ? "#0a7ea4" : "#000"}
                        height={Dimensions.get("window").width * 0.07}
                        width={Dimensions.get("window").width * 0.3}
                        style={{}}
                    />
                )}
                <View style={{ gap: 10, padding: 16, flexDirection: "column", width: "100%", marginTop: 0 }}>
                    <View>
                        <ThemedText type="subtitle">{plateName}</ThemedText>
                        <ThemedText
                            type="default"
                            style={{
                                width: "100%",
                            }}>
                            {content}
                        </ThemedText>
                    </View>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        {tags.map((tag: string, index: number) => {
                            return (
                                <Text
                                    key={index}
                                    style={{
                                        backgroundColor: "#fc0",
                                        color: "#000",
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 20,
                                    }}>
                                    {tag}
                                </Text>
                            );
                        })}
                    </View>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <ThemedText type="default">Overall Rating {rating}</ThemedText>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Entypo name="location-pin" size={24} color="black" />
                        <ThemedText type="default">{restaurantName}</ThemedText>
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

const styles = StyleSheet.create({});
