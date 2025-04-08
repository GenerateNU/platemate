import { Tabs } from "expo-router";
import React, { FunctionComponent } from "react";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";

import { HomeNavIcon, SearchNavIcon, MapNavIcon, ProfileNavIcon } from "@/components/icons/NavIcons";

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
            <Tabs.Screen
                name="map"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon IconComponent={MapNavIcon} color={color} focused={focused} />
                    ),
                }}
            />
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
