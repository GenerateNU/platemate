import React from "react";
import { Image, View, Text, ImageSourcePropType, StyleProp, ImageStyle, ViewStyle, TextStyle } from "react-native";

export interface AvatarProps {
    imageSource?: ImageSourcePropType;
    size?: number; // in dp
    containerStyle?: StyleProp<ViewStyle>;
    fallbackText?: string;
    textStyle?: StyleProp<TextStyle>;
    imageStyle?: StyleProp<ImageStyle>;
}

//  Note: By default, the container uses overflow: "hidden" and a borderRadius
//  of size/2 for a circular shape. If you pass any additional containerStyle,
//  it will merge with these defaults.

export function Avatar({ imageSource, size = 40, containerStyle, fallbackText, textStyle, imageStyle }: AvatarProps) {
    return (
        <View
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2, // Circular!
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                },
                containerStyle,
            ]}>
            {imageSource ? (
                // Fill the container if theres an image
                <Image
                    source={imageSource}
                    style={[
                        {
                            width: "100%",
                            height: "100%",
                            borderRadius: size / 2, // Circular!
                            resizeMode: "cover",
                        },
                        imageStyle,
                    ]}
                />
            ) : fallbackText ? (
                // Display fallback text if no image
                <Text style={textStyle}>{fallbackText}</Text>
            ) : null}
        </View>
    );
}

// Example usage:

// <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//     {/* with image source */}
//     <Avatar
//         imageSource={{ uri: "https://course.khoury.northeastern.edu/cs2510a/ben_lerner.jpg" }}
//         size={50}
//         imageStyle={{ resizeMode: "cover" }}
//     />

//     {/* with fallback text */}
//     <Avatar
//         fallbackText="AB"
//         size={40}
//         containerStyle={{
//             backgroundColor: "#007AFF",
//         }}
//         textStyle={{
//             fontWeight: "bold",
//         }}
//     />
// </View>
