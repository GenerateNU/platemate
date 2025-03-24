"use client";

import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import ToggleSetting from "@/components/profile/settings/ToggleSetting";
import SettingsSection from "@/components/profile/settings/SettingsSection";
import SettingsMenuItem from "@/components/profile/settings/SettingsMenuItem";
import { TSettingsData } from "@/types/settingsData";

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [settings, setSettings] = useState({
        vegetarian: false,
        vegan: false,
        nutFree: false,
        shellfishAllergy: false,
        glutenFree: false,
        dairyFree: false,
        kosher: false,
        halal: false,
        pescatarian: false,
        keto: false,
        diabetic: false,
        soyFree: false,
        cameraAccess: false,
        contactSync: false,
    });

    const updateSetting = (key: string, value: boolean) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            [key]: value,
        }));
    };

    const settingsData: TSettingsData = {
        dietary: [
            { key: "vegetarian", label: "Vegetarian" },
            { key: "vegan", label: "Vegan" },
            { key: "nutFree", label: "Nut-free" },
            { key: "shellfishAllergy", label: "Shellfish allergy" },
            { key: "glutenFree", label: "Gluten-free" },
            { key: "dairyFree", label: "Dairy-free" },
            { key: "kosher", label: "Kosher" },
            { key: "halal", label: "Halal" },
            { key: "pescatarian", label: "Pescatarian" },
            { key: "keto", label: "Keto" },
            { key: "diabetic", label: "Diabetic" },
            { key: "soyFree", label: "Soy-free" },
        ],
        privacy: [
            { key: "cameraAccess", label: "Camera Access" },
            { key: "contactSync", label: "Contact Sync" },
        ],
        account: [
            {
                label: "View Followers",
                onPress: () => router.push("/(tabs)/profile/followers"),
                showChevron: true,
            },
        ],
        additional: [
            { label: "Blocked Users", onPress: () => console.log("navigating to blocked users") },
            { label: "Terms and Conditions", onPress: () => console.log("navigating to terms of service") },
        ],
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: 32 }]} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <SettingsSection title="Dietary Restrictions">
                    {settingsData.dietary.map((item) => (
                        <ToggleSetting
                            key={item.key}
                            label={item.label}
                            value={settings[item.key as keyof typeof settings]}
                            onToggle={(value) => updateSetting(item.key as keyof typeof settings, value)}
                        />
                    ))}
                </SettingsSection>

                <SettingsSection title="Data Privacy">
                    {settingsData.privacy.map((item) => (
                        <ToggleSetting
                            key={item.key}
                            label={item.label}
                            value={settings[item.key as keyof typeof settings]}
                            onToggle={(value) => updateSetting(item.key as keyof typeof settings, value)}
                        />
                    ))}
                </SettingsSection>

                <SettingsSection title="Account">
                    {settingsData.account.map((item, index) => (
                        <SettingsMenuItem
                            key={index}
                            label={item.label}
                            onPress={item.onPress}
                            showChevron={item.showChevron}
                        />
                    ))}
                </SettingsSection>

                <SettingsSection title="Additional Settings">
                    {settingsData.additional.map((item, index) => (
                        <SettingsMenuItem key={index} label={item.label} onPress={item.onPress} />
                    ))}
                </SettingsSection>

                <View style={{ height: insets.bottom + 20 }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 20,
    },
});
