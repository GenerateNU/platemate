import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import UserInfoRowBase from "../UserInfo/UserInfoRowBase";
import { ThemedText } from "../themed/ThemedText";
import { Colors } from "@/constants/Colors";
import Entypo from "@expo/vector-icons/build/Entypo";
import { router } from "expo-router";
import { ReviewComponentStarIcon, StarIcon } from "../icons/Icons";
import Tag from "@/components/ui/Tag";
import { ThemedTag } from "@/components/themed/ThemedTag";
import { ThemedView } from "@/components/themed/ThemedView";

type Props = {
    plateName: string;
    restaurantName: string;
    tags: string[];
    rating: number;
    content: string;
    authorName: string;
    authorUsername: string;
    authorAvatar: string;
    authorId: string;
};

const ReviewPreview = ({
    plateName,
    restaurantName,
    tags,
    rating,
    content,
    authorName,
    authorUsername,
    authorAvatar,
    authorId,
}: Props) => {
    return (
        <View
            style={{
                borderColor: "lightgray",
                backgroundColor: "#FAFAFA",
                padding: 16,
                flex: 1,
                flexDirection: "column",
                gap: 10,
                borderRadius: 12,
                paddingTop: 24,
                width: "100%",
                // height: Dimensions.get("window").height * 0.36,
            }}>
            <ThemedView style={{ width: "100%" }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        width: "100%",
                        paddingRight: 10,
                        backgroundColor: "#fafafa",
                    }}>
                    <View style={{ flex: 1 }}>
                        <UserInfoRowBase
                            name={authorName || "Author Name"}
                            username={authorUsername}
                            icon={authorAvatar}
                            onPress={() => router.push(`/(profile)/${authorId}`)}
                            right={null}
                        />
                    </View>

                    <View
                        style={{
                            position: "absolute",
                            top: 2,
                            right: 4,
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: 0,
                            paddingVertical: 2,
                            borderRadius: 12,
                            zIndex: 1,
                        }}>
                        <ThemedText
                            style={{
                                fontSize: 18,
                                fontWeight: "500",
                                marginTop: 4,
                                marginRight: 4,
                            }}>
                            {rating}
                        </ThemedText>
                        <StarIcon width={24} height={24} filled={true} />
                    </View>
                </View>
            </ThemedView>
            <View style={{ gap: 8 }}>
                <View style={styles.plateInfoContainer}>
                    <View style={styles.nameContainer}>
                        <ThemedText type="subtitle" style={[styles.nameText, { fontWeight: 700 }]}>
                            {plateName}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.nameText, { fontWeight: 400 }]}>
                            {restaurantName}
                        </ThemedText>
                    </View>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollableTags}>
                    {tags.map((tag, index) => (
                        <ThemedTag
                            key={index}
                            title={tag}
                            backgroundColor={"#FFCF0F"}
                            textColor={"#000"}
                            textStyle={{ paddingVertical: 0, fontSize: 12 }}
                        />
                    ))}
                </ScrollView>
                <ThemedText type="default" style={styles.contentContainer} numberOfLines={3} ellipsizeMode="tail">
                    {content}
                </ThemedText>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
                    <TouchableOpacity>
                        <Entypo name="arrow-up" size={24} color="gray" />
                    </TouchableOpacity>
                    <ThemedText type="default">0</ThemedText>
                    <TouchableOpacity>
                        <Entypo name="arrow-down" size={24} color="gray" />
                    </TouchableOpacity>
                    <ThemedText type="default">0</ThemedText>
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
    },
    tag: {
        backgroundColor: "#fc0",
        color: "#000",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 12,
        fontFamily: "Nunito",
        fontWeight: 500,
    },
    plateInfoContainer: {
        display: "flex",
        flexDirection: "row",
        width: 267,
        marginTop: 4,
        paddingRight: 10,
        paddingLeft: 4,
        justifyContent: "space-between",
        alignItems: "center",
    },
    nameContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    nameText: {
        color: "#000",
        fontFamily: "Nunito",
        fontSize: 16,
        fontStyle: "normal",
        lineHeight: 18,
    },
    numericalRatingContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        alignSelf: "stretch",
        marginLeft: 10,
    },
    contentContainer: {
        overflow: "hidden",
        color: "#000",
        textOverflow: "ellipsis",
        fontFamily: "Nunito",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 16,
        paddingTop: 4,
        paddingHorizontal: 4,
    },
});
