import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "react-native";
import { AuthProvider } from "@/providers/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StatusBarHeader from "@/app/StatusBarHeader";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        DamionRegular: require("../assets/fonts/Damion-Regular.ttf"),
        Outfit: require("../assets/fonts/Outfit-Variable.ttf"),
        NeueHaasUnicaProBold: require("../assets/fonts/NeueHaasUnicaPro-Bold.ttf"),
        NeueHaasUnicaProMedium: require("../assets/fonts/NeueHaasUnicaPro-Medium.ttf"),
        NeueHaasUnicaProRegular: require("../assets/fonts/NeueHaasUnicaPro-Regular.ttf"),
        NeueHaasUnicaProHeavy: require("../assets/fonts/NeueHaasUnicaPro-Heavy.ttf"),
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
        <AuthProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <GestureHandlerRootView>
                    <StatusBarHeader />
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                        <Stack.Screen name="(auth)/register" />
                    </Stack>
                    <StatusBar style="auto" />
                </GestureHandlerRootView>
            </ThemeProvider>
        </AuthProvider>
    );
}
