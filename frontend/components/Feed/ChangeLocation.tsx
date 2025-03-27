// import { Dimensions, Image, Text, View, ScrollView } from "react-native";
import { Dimensions, View } from "react-native";
import React from "react";
import { ThemedText } from "../themed/ThemedText";
import Entypo from "@expo/vector-icons/build/Entypo";

const ChangeLocation = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center", // Centers the child vertically
                alignItems: "center", // Centers the child horizontally
                backgroundColor: "#f0f0f0", // Optional background color
            }}>
            <View
                style={{
                    flexDirection: "column",
                    width: Dimensions.get("window").width * 0.8,
                    height: Dimensions.get("window").height * 0.66,
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 32,
                }}>
                <View>
                    <ThemedText>BALLSSS</ThemedText>
                </View>
                <View>
                    <ThemedText type="subtitle">YUR</ThemedText>
                    <ThemedText
                        type="default"
                        style={{
                            width: "100%",
                        }}
                        lightColor="blue"
                        darkColor="red">
                        ALSO YURRR
                    </ThemedText>
                </View>

                <View style={{ flexDirection: "row", gap: 12 }}>
                    <ThemedText type="default">SHEESHHH</ThemedText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Entypo name="location-pin" size={24} color="black" />
                    <ThemedText type="default">STINKY MF</ThemedText>
                </View>
            </View>
        </View>
    );
};

export default ChangeLocation;
