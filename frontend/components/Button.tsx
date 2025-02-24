import React, { PropsWithChildren } from "react";
import {
    TouchableOpacity,
    Text,
    type StyleProp,
    type TextStyle,
    type ViewStyle,
    type TouchableOpacityProps,
} from "react-native";

export interface ButtonProps extends TouchableOpacityProps, PropsWithChildren<object> {
    title?: string;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export function Button(props: ButtonProps) {
    const { onPress, title, containerStyle, textStyle, children, ...rest } = props;

    return (
        // Fill in rest with whatever you want to pass to the View or TouchableOpacity component!
        <TouchableOpacity onPress={onPress} style={containerStyle} {...rest}>
            {title ? <Text style={textStyle}>{title}</Text> : children}
        </TouchableOpacity>
    );
}

// Example usage:

// import { Button } from "@/components/Button";
// import { Alert, View } from "react-native";
{
    /* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Click Me!"
        onPress={() => Alert.alert("Button Pressed!")}
        containerStyle={{
          padding: 12,
          borderRadius: 8,
          // more styles etc...
        }}
        textStyle={{
          // color: "#FFFFFF",
        }}
      />
    </View> */
}
