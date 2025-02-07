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

interface CardProps extends ViewProps, PropsWithChildren<{}> {
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
