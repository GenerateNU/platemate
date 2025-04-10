import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed/ThemedText";
import { Avatar } from "../Avatar";
import { router } from "expo-router";

type Props = {
    name: string;
    username: string;
    right: React.ReactNode;
    icon: string;
    id?: string;
    large?: boolean;
    onPress: () => void;
};

const UserInfoRowBase = ({ name, username, right, icon, large, onPress, id }: Props) => (
    <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
        <TouchableOpacity
            disabled={id ? false : true}
            onPress={() => {
                if (id) {
                    router.push(`/(profile)/${id}`);
                    return;
                }
            }}>
            <View style={styles.row}>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                    <Avatar imageSource={{ uri: icon }} size={large ? 64 : 48} />
                    <View style={{ gap: 0 }}>
                        <TouchableOpacity onPress={onPress}>
                            <ThemedText
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                type="default"
                                style={styles.nameContainer}>
                                {name}
                            </ThemedText>
                            <ThemedText
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                type="caption"
                                style={styles.usernameContainer}>
                                @{username}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
                {right}
            </View>
        </TouchableOpacity>
    </View>
);

export default UserInfoRowBase;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
    },
    nameContainer: {
        color: "#000",
        fontFamily: "Nunito",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: 18,
    },
    usernameContainer: {
        color: "#000",
        fontFamily: "Nunito",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 16,
    },
});
