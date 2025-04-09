import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { BackChevron } from "@/components/icons/Icons";
import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { FilterProvider } from "@/context/filter-context";

export default function IndexLayout() {
    const router = useRouter();
    return (
        <FilterProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    headerShadowVisible: false,
                    animation: "slide_from_right",
                }}>
                <Stack.Screen name="search" options={{ headerShown: false }} />
                <Stack.Screen
                    name="filter"
                    options={{
                        headerShown: true,
                        headerTransparent: true,
                        headerBackVisible: false,
                        contentStyle: { paddingTop: 0 },
                        statusBarTranslucent: true,
                        headerLeft: ({ canGoBack }) => {
                            return canGoBack ? (
                                <TouchableOpacity onPress={() => router.back()}>
                                    <BackChevron style={{ marginLeft: 4, marginRight: 8 }} />
                                </TouchableOpacity>
                            ) : null;
                        },
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
        </FilterProvider>
    );
}
