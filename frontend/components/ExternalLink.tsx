import { Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { type ComponentProps } from "react";
import { Platform, Alert } from "react-native";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string | any };

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function ExternalLink({ href, ...rest }: Props) {
    return (
        <Link
            target="_blank"
            {...rest}
            href={href}
            onPress={async (event) => {
                if (Platform.OS !== "web") {
                    event.preventDefault();

                    if (!isValidUrl(href)) {
                        Alert.alert("Invalid URL", "An invalid URL was provided.");
                        return;
                    }

                    await openBrowserAsync(href);
                }
            }}
        />
    );
}
