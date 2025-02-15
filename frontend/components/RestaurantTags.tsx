
import React from "react";
import { Button } from "@/components/Button";
import { Alert, View } from "react-native";
const TagButton = ({ title }: { title: string }) => {
    return (
        <Button
            title={title}
            onPress={() => Alert.alert("Button Pressed!")}
            containerStyle={{
            padding: 12,
            borderRadius: 50,
            borderWidth: 1,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderColor: "#285852",
            // more styles etc...
            }}
            textStyle={{
                textAlign: "center",
                color: "#285852",
                fontFamily: "Source Sans 3",
                fontWeight: "500",
                fontSize: 14,
                lineHeight: 18,
                letterSpacing: 0,
            }}
        />
    );
}
interface TagButtonProps {
    tags: string[];
}

export function RestaurantTags({ tags }: TagButtonProps) {
    return (
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {tags.map((tag, index) => (
          <TagButton key={index} title={tag} />
        ))}
      </View>
    );
}
