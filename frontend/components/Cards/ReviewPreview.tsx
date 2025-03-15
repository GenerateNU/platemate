import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import UserInfoRowBase from "../UserInfo/UserInfoRowBase";
import { ThemedText } from "../ThemedText";
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
                height: Dimensions.get("window").height * 0.4,
            }}>
            <UserInfoRowBase
                name={"Beak"}
                username={"beakerboy"}
                right={<View />}
                icon={"https://ca.slack-edge.com/T2CHL6FEG-U07KG3RKBDX-a3dd191230d7-512"}
            />
            <View style={{ gap: 10 }}>
                <View>
                    <ThemedText type="subtitle" style={{ fontFamily: "Source Sans 3" }}>
                        {plateName}
                    </ThemedText>
                    <ThemedText type="default" style={{ fontFamily: "Source Sans 3" }}>
                        {restaurantName}
                    </ThemedText>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollableTags}>
                    {tags.map((tag, index) => (
                        <Text key={index} style={styles.tag}>
                            {tag}
                        </Text>
                    ))}
                </ScrollView>
                <ThemedText
                    type="default"
                    style={{ fontFamily: "Source Sans 3" }}
                    numberOfLines={3}
                    ellipsizeMode="tail">
                    {content}
                </ThemedText>
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

const styles = StyleSheet.create({
    scrollableTags: {
        flexDirection: "row",
        gap: 8,
    },
    tag: {
        backgroundColor: "#fc0",
        color: "#000",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 12,
    },
});
