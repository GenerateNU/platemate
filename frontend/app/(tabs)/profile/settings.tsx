"use client";

import { ScrollView, View, StyleSheet, TextInput, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import ToggleSetting from "@/components/profile/settings/ToggleSetting";
import SettingsSection from "@/components/profile/settings/SettingsSection";
import SettingsMenuItem from "@/components/profile/settings/SettingsMenuItem";
import { TSettingsData } from "@/types/settingsData";
import useAuthStore from "@/auth/store";
import { Button } from "@/components/Button";

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { email } = useAuthStore();

    const { logout } = useAuthStore();

    const dietaryOptions = [
        "vegetarian",
        "vegan",
        "nutFree",
        "shellfishAllergy",
        "glutenFree",
        "dairyFree",
        "kosher",
        "halal",
        "pescatarian",
        "keto",
        "diabetic",
        "soyFree",
        "porkFree",
        "beefFree",
    ];

    const [settings, setSettings] = useState<Record<string, boolean>>(
        Object.fromEntries(dietaryOptions.map((option) => [option, false])),
    );

    // useEffect(() => {
    //     const fetchPreferences = async () => {
    //         try {
    //             const userData = await fetchUserProfile(); // Fetch user profile using the context function

    //             if (!userData) return; // Ensure userData exists before proceeding

    //             const userRestrictions: string[] = userData.preferences || [];

    //             // Convert restrictions array to object { vegetarian: true, glutenFree: true, keto: true, ... }
    //             const updatedSettings = dietaryOptions.reduce((acc, option) => {
    //                 acc[option] = userRestrictions.includes(option);
    //                 return acc;
    //             }, {} as Record<string, boolean>);

    //             setSettings(updatedSettings);
    //         } catch (error) {
    //             console.error("Error fetching user preferences:", error);
    //         }
    //     };

    //     fetchPreferences();
    // }, [fetchUserProfile]);

    const updateSetting = (key: string, value: boolean) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            [`${key}`]: value,
        }));
    };

    // const updateSetting = async (key: string, value: boolean) => {
    //     try {
    //         const updatedSettings = { ...settings, [key]: value };
    //         setSettings(updatedSettings);

    //         // Send updated preferences to the server
    //         await axios.put(`${process.env.API_BASE_URL}/api/v1/user/${userId}`, {
    //             preferences: { restrictions: Object.keys(updatedSettings).filter((k) => updatedSettings[k]) },
    //         });
    //     } catch (error) {
    //         console.error("Error saving setting:", error);
    //     }
    // };

    const settingsData: TSettingsData = {
        credentials: [
            { key: "accountEmail", label: "Email" },
            { key: "accountPassword", label: "Password" },
        ],
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
            { key: "porkFree", label: "Pork-free" },
            { key: "beefFree", label: "Beef-free" },
        ],
        privacy: [
            { key: "cameraAccess", label: "Camera Access" },
            { key: "contactSync", label: "Contact Sync" },
        ],
        account: [
            {
                label: "View Friends",
                onPress: () => router.push("/(tabs)/profile/followers"),
                showChevron: true,
            },
        ],
        additional: [
            { label: "Blocked Users", onPress: () => console.log("navigating to blocked users") },
            { label: "Terms and Conditions", onPress: () => console.log("navigating to terms of service") },
        ],
    };

    const handleLogOut = () => {
        logout();
        router.replace("/(onboarding)");
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: 60 }]} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <SettingsSection title="Account">
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={"**********"}
                            secureTextEntry
                            editable={false}
                        />
                    </View>
                    <Text style={styles.resetPasswordText}> Reset Password </Text>
                </SettingsSection>
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

                <Button title="Log Out" containerStyle={styles.buttonContainer} textStyle={styles.buttonText} onPress={handleLogOut} />

                <View style={{ height: insets.bottom + 50 }} />
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
        fontFamily: "Inter",
        padding: 20,
    },
    buttonContainer: {
        display: "flex",
        paddingVertical: 4,
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        borderRadius: 25,
        backgroundColor: "#FFCF0F",
        alignSelf: "center",
        width: 90,
        height: 30,
    },
    buttonText: {
        color: "#000",
        textAlign: "center",
        fontFamily: "Source Sans 3",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: 18,
    },
    sectionContainer: {
        gap: 28,
    },
    accountContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "stretch",
    },
    emailPasswordContainer: {
        gap: 4,
    },
    inputContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "#FFFFFF",
        width: 382,
    },
    inputLabel: {
        fontSize: 10,
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
    },
    input: {
        fontSize: 12,
        height: 35,
        borderColor: "#D9D9D9",
        borderWidth: 1,
        borderRadius: 11,
        paddingHorizontal: 10,
        backgroundColor: "white",
        color: "#000000",
        width: 350, // the email and password boxes were not aligning with the toggles
        flexShrink: 0,
        alignItems: "flex-start",
    },
    sectionTitle: {
        fontSize: 20,
        color: "#151619",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: 28,
        fontFamily: "Inter",
    },
    resetPasswordText: {
        color: "#285852",
        textAlign: "right",
        fontFamily: "Inter",
        fontSize: 10,
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
    },
});
