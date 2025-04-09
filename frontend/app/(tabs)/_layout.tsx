import { Tabs } from "expo-router";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Platform, View } from "react-native";
import useAuthStore from "@/auth/store";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";

import { HomeNavIcon, SearchNavIcon, RestaurantAnalyticsNavIcon, ProfileNavIcon } from "@/components/icons/NavIcons";

type TabIconProps = {
    IconComponent: FunctionComponent<any>;
    color: string;
    focused: boolean;
};

const TabIcon = ({ IconComponent, color, focused }: TabIconProps) => (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
        <IconComponent color={focused ? color : "#888"} width={24} height={24} />
        {focused && (
            <View
                style={{
                    position: "absolute",
                    bottom: -12,
                    width: 6,
                    height: 6,
                    backgroundColor: color,
                    borderRadius: 3,
                }}
            />
        )}
    </View>
);

export default function TabLayout() {
    // Get authentication state and restaurant owner status
    const { isAuthenticated, isRestaurantOwner, ownedRestaurantId } = useAuthStore();
    const [showRestaurantAnalyticsTab, setShowRestaurantAnalyticsTab] = useState(false);

    // Update tab visibility when auth state changes
    useEffect(() => {
        // Show the restaurant analytics tab only if the user is authenticated and is a restaurant owner
        setShowRestaurantAnalyticsTab(isAuthenticated && isRestaurantOwner && !!ownedRestaurantId);
    }, [isAuthenticated, isRestaurantOwner, ownedRestaurantId]);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#F7B418",
                headerShown: false,
                tabBarShowLabel: false,
                headerTitleStyle: {
                    fontFamily: "Outfit",
                },
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: "absolute",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingTop: 8,
                        paddingHorizontal: 16,
                        borderTopWidth: 0,
                        backgroundColor: "transparent",
                    },
                    default: {},
                }),

                tabBarIcon: ({ color, focused }) => (
                    <View style={{ alignItems: "center" }}>
                        {focused && (
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: -12,
                                    width: 6,
                                    height: 6,
                                    backgroundColor: color,
                                    borderRadius: 2,
                                }}
                            />
                        )}
                    </View>
                ),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon IconComponent={HomeNavIcon} color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon IconComponent={SearchNavIcon} color={color} focused={focused} />
                    ),
                }}
            />
            {/* Conditionally render the restaurant analytics tab */}
            {showRestaurantAnalyticsTab && (
                <Tabs.Screen
                    name="restaurantAnalytics"
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon IconComponent={RestaurantAnalyticsNavIcon} color={color} focused={focused} />
                        ),
                    }}
                />
            )}
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon IconComponent={ProfileNavIcon} color={color} focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}
