import React from "react";
import { View, Text, StyleProp, ViewStyle, TextStyle } from "react-native";

export interface BadgeProps {
    text?: string;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export function Badge({ text, containerStyle, textStyle }: BadgeProps) {
    return <View style={containerStyle}>{text ? <Text style={textStyle}>{text}</Text> : null}</View>;
}

// Example usage:

// import { Badge } from "@/components/Badge";
{
    /* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Badge
        text="New!"
        containerStyle={{
          // backgroundColor: "red",
          // borderRadius: 12,
          // paddingHorizontal: 8,
          // paddingVertical: 4,
        }}
        textStyle={{
          // fontWeight: "bold",
        }}
      />
    </View> */
}
