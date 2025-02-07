import React, { PropsWithChildren } from "react";
import { View, TouchableOpacity, Text, ViewProps } from "react-native";

interface SearchResultItemProps extends PropsWithChildren<ViewProps> {
    title: string;
    subtitle?: string;
    onPress?: () => void;
}

export function SearchResultItem({ title, subtitle, onPress, children, style, ...rest }: SearchResultItemProps) {
    const Container = onPress ? TouchableOpacity : View;

    return (
        // Fill in rest with whatever you want to pass to the View or TouchableOpacity component!
        <Container onPress={onPress} style={style} {...rest}>
            <Text>{title}</Text>
            {subtitle && <Text>{subtitle}</Text>}
            {children}
        </Container>
    );
}

// Example usage:

// import { SearchResultItem } from "@/components/SearchResultItem";

// <SearchResultItem
//   title="Spaghetti Bolognese"
//   subtitle="A classic Italian favorite!"
//   onPress={() => console.log("Item pressed!")}
// />
