import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import BackChevron from "@/assets/icons/arrow_back_ios.svg";
import { Text, View, Platform} from "react-native";

import { useColorScheme } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        // Outfit: require("../assets/fonts/Outfit-Variable.ttf"),
        // SofiaSans: require("../assets/fonts/SofiaSans-Variable.ttf"),
        SourceSans3: require("../assets/fonts/SourceSans3-Variable.ttf"),
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
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack
                screenOptions={{
                    headerTitleStyle: {
                        fontFamily: "Source Sans 3",
                    },
                    headerShown: false,
                }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen
                    name="filter"
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
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
