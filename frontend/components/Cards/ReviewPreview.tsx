import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import UserInfoRowBase from "../UserInfo/UserInfoRowBase";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import Entypo from "@expo/vector-icons/build/Entypo";

type Props = {
    plateName: string;
    restaurantName: string;
    tags: string[];
    rating: number;
    content: string;
};

const ReviewPreview = ({ plateName, restaurantName, tags, rating, content }: Props) => {
    const color = useThemeColor({ light: "#000", dark: "#fff" }, "text");
    return (
        <View
            style={{
                backgroundColor: Colors["light"].foreground,
                padding: 16,
                flex: 1,
                flexDirection: "column",
                gap: 10,
                borderRadius: 12,
                paddingTop: 24,
                width: Dimensions.get("window").width * 0.75,
            }}>
            <UserInfoRowBase
                name={"Beak"}
                username={"beakerboy"}
                right={<View />}
                icon={
                    "https://media.licdn.com/dms/image/v2/D4E03AQHfL9dfqDis5w/profile-displayphoto-shrink_200_200/B4EZRxo377GwAY-/0/1737073329197?e=2147483647&v=beta&t=Es1EwoIQ-ssmHQmHQiLmz2W1KmEqYu8trkRksVySAeo"
                }
            />
            <View style={{ gap: 10 }}>
                <View>
                    <ThemedText type="subtitle">{plateName}</ThemedText>
                    <ThemedText type="default">{restaurantName}</ThemedText>
                </View>
                <View style={{ flexDirection: "row", gap: 12 }}>
                    {tags.map((tag: string, index: number) => {
                        return (
                            <ThemedText
                                key={index}
                                type="defaultSemiBold"
                                style={{
                                    backgroundColor: "#fc0",
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    borderRadius: 20,
                                }}>
                                {tag}
                            </ThemedText>
                        );
                    })}
                </View>
                <ThemedText type="default">{content}</ThemedText>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                    <TouchableOpacity>
                        <Entypo name="arrow-with-circle-up" size={32} color="black" />
                    </TouchableOpacity>
                    <ThemedText type="default">123</ThemedText>
                    <TouchableOpacity>
                        <Entypo name="arrow-with-circle-down" size={32} color="black" />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity>
                        <Entypo name="dots-three-vertical" size={16} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ReviewPreview;

const styles = StyleSheet.create({});
