import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import BackChevron from "@/assets/icons/arrow_back_ios.svg";
import { Text, View, Platform} from "react-native";

import { SafeAreaView, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/context/user-context";
import { AuthInitializer } from "@/components/AuthInitializer";
import { Host } from "react-native-portalize";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
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
                                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                    <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
                                    <Stack.Screen name="[...missing]" options={{ title: "Not Found" }} />
                                    <Stack.Screen name="filter"
                    options={{
                        headerShown: true,
                        headerTransparent: true,
                        headerBackVisible: false,
                        // headerTitleAlign: "left",
                        headerLeft: ({ canGoBack }) => (canGoBack ? <BackChevron style={{ }} /> : null),
                        headerBackButtonDisplayMode: "minimal",
                        headerTitle: () => (
                            <View style={{ flex: 1}}>
                              <Text
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: "700",
                                  fontSize: 28,
                                  color: "#151619",
                                }}
                              >
                                Filters
                              </Text>
                            </View>
                        ),
                        headerStyle: {
                            backgroundColor: "transparent",
                        },
                        headerShadowVisible: false,
                        ...Platform.select({
                            ios: {
                                headerBlurEffect: "light",
                            },
                        }),
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
