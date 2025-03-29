import React, { PropsWithChildren } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    type ImageSourcePropType,
    type ViewProps,
    type StyleProp,
    type ViewStyle,
    type ImageStyle,
} from "react-native";

interface CardProps extends ViewProps, PropsWithChildren<object> {
    imageSource: ImageSourcePropType;
    imageStyle?: StyleProp<ImageStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

export function Card({ imageSource, imageStyle, contentContainerStyle, onPress, children, style, ...rest }: CardProps) {
    // Use TouchableOpacity if onPress is availabele for tapping!
    const Container = onPress ? TouchableOpacity : View;

    return (
        // Fill in rest with whatever you want to pass to the View or TouchableOpacity component!
        <Container onPress={onPress} style={style} {...rest}>
            <Image source={imageSource} style={imageStyle} />
            {children && <View style={contentContainerStyle}>{children}</View>}
        </Container>
    );
}

// Example usage:

// In parent ([id].tsx here):
// import { Card } from "@/components/Card";

// <ThemedView style={{ marginTop: 20 }}>
//     <Card
//         imageSource={require("@/assets/images/partial-react-logo.png")}
//         imageStyle={styles.cardImage}
//         contentContainerStyle={styles.cardContent}
//         onPress={() => console.log("Card Pressed")}
//         style={styles.cardContainer}>
//         <ThemedText type={"default"} style={{ fontFamily: "Outfit", textAlign: "center" }}>
//             This is a sample card with an image.
//         </ThemedText>
//     </Card>
// </ThemedView>

// In styylesheet:
// cardContainer: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     overflow: "hidden",
//     margin: 10,
//     padding: 10,
//     alignItems: "center",
// },
// cardImage: {
//     width: 150,
//     height: 100,
//     borderRadius: 5,
//     marginBottom: 10,
// },
// cardContent: {
//     alignItems: "center",
// },
