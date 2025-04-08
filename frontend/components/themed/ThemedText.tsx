import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link" | "caption" | "sectionTitle";
};

export function ThemedText({ style, lightColor, darkColor, type = "default", ...rest }: ThemedTextProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return (
        <Text
            style={[
                { color },
                { fontFamily: "Source Sans 3" },
                type === "default" ? styles.default : undefined,
                type === "title" ? styles.title : undefined,
                type === "sectionTitle" ? styles.sectionTitle : undefined,
                type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
                type === "subtitle" ? styles.subtitle : undefined,
                type === "link" ? styles.link : undefined,
                type === "caption" ? styles.caption : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: "Source Sans 3",
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "600",
        fontFamily: "Source Sans 3",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        fontFamily: "Source Sans 3",
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Source Sans 3",
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "Source Sans 3",
    },
    caption: {
        fontSize: 14,
        fontWeight: "regular",
        fontFamily: "Source Sans 3",
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: "#0a7ea4",
        fontFamily: "Source Sans 3",
    },
});
