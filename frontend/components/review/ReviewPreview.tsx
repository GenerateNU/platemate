import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import UserInfoRowBase from "../UserInfo/UserInfoRowBase";
import { ThemedText } from "../themed/ThemedText";
import { Colors } from "@/constants/Colors";
import Entypo from "@expo/vector-icons/build/Entypo";
import { router, useNavigation } from "expo-router";
import { ReviewComponentStarIcon } from "../icons/Icons";

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
    const navigation = useNavigation();

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
                width: "100%",
                height: Dimensions.get("window").height * 0.36,
            }}>
            <UserInfoRowBase
                name={"First Last"}
                username={authorUsername}
                right={<View />}
                icon={authorAvatar}
                onPress={() => router.push(`/(profile)/${authorId}`)}
            />
            <View style={{ gap: 10 }}>
                <View style={styles.plateInfoContainer}>
                    <View style={styles.nameContainer}>
                        <ThemedText type="subtitle" style={[styles.nameText, { fontWeight: 700 }]}>
                            {plateName}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.nameText, { fontWeight: 400 }]}>
                            {restaurantName}
                        </ThemedText>
                    </View>
                    <View style={styles.numericalRatingContainer}>
                        <ThemedText style={[styles.nameText, { fontWeight: 400 }]}>{rating}</ThemedText>
                        <ReviewComponentStarIcon width={35} height={35} style={{ marginBottom: -5 }} />
                    </View>
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
                <ThemedText type="default" style={styles.contentContainer} numberOfLines={3} ellipsizeMode="tail">
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
        fontFamily: "Source Sans 3",
        fontWeight: 500,
    },
    plateInfoContainer: {
        display: "flex",
        flexDirection: "row",
        width: 267,
        paddingVertical: 3,
        paddingRight: 10,
        paddingLeft: 4,
        justifyContent: "space-between",
        alignItems: "center",
    },
    nameContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 2,
    },
    nameText: {
        color: "#000",
        fontFamily: "Source Sans 3",
        fontSize: 16,
        fontStyle: "normal",
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
        fontFamily: "Source Sans 3",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 16,
    },
});
