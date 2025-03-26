import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { BackChevron } from "@/components/icons/Icons";

import { Text, View, Platform } from "react-native";

import { SafeAreaView, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/context/user-context";
import { AuthInitializer } from "@/components/AuthInitializer";
import { Host } from "react-native-portalize";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();

    const [loaded] = useFonts({
        DamionRegular: require("../assets/fonts/Damion-Regular.otf"),
        Outfit: require("../assets/fonts/Outfit-Variable.otf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <Host>
            <AuthInitializer>
                <UserProvider>
                    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                        <SafeAreaView>
                            <StatusBar backgroundColor={"black"} animated={true} style={"dark"} translucent={false} />
                        </SafeAreaView>
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <BottomSheetModalProvider>
                                <Stack>
                                    <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
                                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                    <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
                                    <Stack.Screen name="[...missing]" options={{ title: "Not Found" }} />
                                    <Stack.Screen
                                        name="filter"
                                        options={{
                                            headerShown: true,
                                            headerTransparent: true,
                                            headerBackVisible: false,
                                            contentStyle: { paddingTop: 0 },
                                            statusBarTranslucent: true,
                                            headerLeft: ({ canGoBack }) =>
                                                canGoBack ? (
                                                    <BackChevron style={{ marginLeft: 4, marginRight: 8 }} />
                                                ) : null,
                                            headerBackButtonDisplayMode: "minimal",
                                            headerTitle: () => (
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: "Inter",
                                                            fontWeight: "700",
                                                            fontSize: 28,
                                                            color: Colors.darkGrey,
                                                        }}>
                                                        Filters
                                                    </Text>
                                                </View>
                                            ),
                                            headerStyle: {
                                                backgroundColor: Colors.white,
                                            },
                                            headerShadowVisible: false,
                                            animation: "slide_from_right",
                                        }}
                                    />
                                </Stack>
                            </BottomSheetModalProvider>
                        </GestureHandlerRootView>
                    </ThemeProvider>
                </UserProvider>
            </AuthInitializer>
        </Host>
    );
}
