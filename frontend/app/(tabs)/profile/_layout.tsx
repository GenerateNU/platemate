import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { BackChevron } from "@/components/icons/Icons";

export default function ProfileLayout() {
    const router = useRouter();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
                headerBackVisible: false,
                headerLeft: ({ canGoBack }) => {
                    return canGoBack ? (
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 10 }}>
                            <BackChevron />
                        </TouchableOpacity>
                    ) : null;
                },
                headerTintColor: "#F7B418",
                headerBackButtonDisplayMode: "minimal",
                headerTitleStyle: {
                    fontFamily: "Outfit",
                    fontWeight: "500",
                    fontSize: 18,
                    color: "#333",
                },
                headerStyle: {
                    backgroundColor: "white",
                },
                headerShadowVisible: false,
                animation: "slide_from_right",
            }}>
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen
                name="settings"
                options={{
                    title: "PlateMate Settings",
                    headerTitleAlign: "left",
                    headerTitleStyle: {
                        fontFamily: "Outfit",
                        fontWeight: "600",
                        fontSize: 20,
                        color: "#333",
                    },
                }}
            />
            <Stack.Screen
                name="followers"
                options={{
                    title: "Your Followers",
                    headerTitleAlign: "left",
                    headerTitleStyle: {
                        fontFamily: "Outfit",
                        fontWeight: "600",
                        fontSize: 20,
                        color: "#333",
                    },
                }}
            />
        </Stack>
    );
}
