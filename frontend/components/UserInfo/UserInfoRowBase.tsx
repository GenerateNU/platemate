import React from "react";
import { TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "../ThemedText";
import { Avatar } from "../Avatar";

type Props = {
    name: string;
    username: string;
    right: React.ReactNode;
    icon: string;
    id?: string;
    large?: boolean;
};

const UserInfoRowBase = ({ name, username, right, icon, large }: Props) => (
    <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
        <View style={styles.row}>
            <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                <Avatar imageSource={{ uri: icon }} size={large ? 64 : 48} />
                <View style={{ gap: 0 }}>
                    <ThemedText numberOfLines={1} ellipsizeMode="tail" type="default" style={{ fontWeight: "700" }}>
                        {name}
                    </ThemedText>
                    <ThemedText numberOfLines={1} ellipsizeMode="tail" type="caption">
                        @{username}
                    </ThemedText>
                </View>
            </View>
            {right}
        </View>
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
});
