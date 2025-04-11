"use client";

import { ScrollView, View, StyleSheet, TextInput, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import ToggleSetting from "@/components/profile/settings/ToggleSetting";
import SettingsSection from "@/components/profile/settings/SettingsSection";
import SettingsMenuItem from "@/components/profile/settings/SettingsMenuItem";
import { TSettingsData } from "@/types/settingsData";
import useAuthStore from "@/auth/store";
import { Button } from "@/components/Button";
import { makeRequest } from "@/api/base";

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { email, userId, logout } = useAuthStore();

    console.log(userId, email);

    const dietaryOptions: Record<string, string> = {
        vegetarian: "Vegetarian",
        vegan: "Vegan",
        nutFree: "Nut-free",
        shellfishAllergy: "Shellfish Allergy",
        glutenFree: "Gluten-free",
        dairyFree: "Dairy-free",
        kosher: "Kosher",
        halal: "Halal",
        pescatarian: "Pescatarian",
        keto: "Keto",
        diabetic: "Diabetic",
        soyFree: "Soy-free",
        porkFree: "Pork-free",
        beefFree: "Beef-free",
    };

    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
    const [settings, setSettings] = useState<Record<string, boolean>>({});
    const [pendingApiCalls, setPendingApiCalls] = useState<Record<string, boolean>>({});

    // Initial data fetch
    useEffect(() => {
        const fetchDietaryPreferences = async () => {
            try {
                console.log(`Fetching dietary preferences for user: ${userId}`);
                const preferencesData = await makeRequest(`/api/v1/settings/${userId}/dietaryPreferences`, "GET");
                console.log("Received preferences data:", preferencesData);

                if (!preferencesData) {
                    console.warn("No preferences data returned");
                    setDietaryPreferences([]);
                    return;
                }

                setDietaryPreferences(preferencesData);
            } catch (err) {
                console.error("Error fetching dietary preferences:", err);
                setDietaryPreferences([]);
            }
        };

        if (userId) {
            fetchDietaryPreferences();
        } else {
            console.log("No userId available for fetching preferences");
        }
    }, [userId]);

    useEffect(() => {
        console.log("Dietary preferences updated:", dietaryPreferences);

        const newSettings = Object.fromEntries(
            Object.entries(dietaryOptions).map(([key, value]) => [key, dietaryPreferences.includes(value)]),
        );

        newSettings.cameraAccess = settings.cameraAccess || false;
        newSettings.contactSync = settings.contactSync || false;

        console.log("New settings state:", newSettings);
        setSettings(newSettings);
    }, [dietaryPreferences]);

    const updatePreferenceApi = useCallback(
        async (key: string, value: boolean) => {
            if (!userId) {
                console.log("No userId available");
                return;
            }

            const preference = dietaryOptions[key];
            if (!preference) {
                console.log(`No preference found for key: ${key}`);
                return;
            }

            console.log(`Updating preference: ${preference} to ${value ? "add" : "remove"}`);
            setPendingApiCalls((prev) => ({ ...prev, [key]: true }));

            if (value) {
                const result = await makeRequest(
                    `/api/v1/settings/${userId}/dietaryPreferences?preference=${preference}`,
                    "POST",
                    null,
                );
                console.log("Add preference result:", result);
            } else {
                const result = await makeRequest(
                    `/api/v1/settings/${userId}/dietaryPreferences?preference=${preference}`,
                    "DELETE",
                    null,
                );
                console.log("Remove preference result:", result);
            }
            setPendingApiCalls((prev) => ({ ...prev, [key]: false }));
        },
        [userId, dietaryOptions],
    );

    const updateSetting = useCallback(
        (key: string, value: boolean) => {
            console.log(`Toggle: ${key} to ${value}`);

            setSettings((prev) => ({ ...prev, [key]: value }));

            if (dietaryOptions[key]) {
                const preference = dietaryOptions[key];
                console.log(`Updating dietary preference: ${preference} to ${value ? "enabled" : "disabled"}`);

                if (value) {
                    setDietaryPreferences((prev) => {
                        const newPrefs = prev.includes(preference) ? prev : [...prev, preference];
                        console.log("Updated preferences (add):", newPrefs);
                        return newPrefs;
                    });
                } else {
                    setDietaryPreferences((prev) => {
                        const newPrefs = prev.filter((item) => item !== preference);
                        console.log("Updated preferences (remove):", newPrefs);
                        return newPrefs;
                    });
                }

                updatePreferenceApi(key, value);
            } else {
                console.log(`${key} is not a dietary option, no API call needed`);
            }
        },
        [updatePreferenceApi, dietaryOptions],
    );

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
                onPress: () => router.push(`/profile/friends?userId=${userId}`),
                showChevron: true,
            },
        ],
        additional: [
            { label: "Blocked Users", onPress: () => console.log("navigating to blocked users") },
            { label: "Terms and Conditions", onPress: () => router.push("/profile/terms") },
        ],
    };

    const handleLogOut = async () => {
        await logout();
        router.push("/(onboarding)");
    };

    const handleResetPassword = () => {
        console.log("Reset password requested");
    };

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
                    <Text style={styles.resetPasswordText} onPress={handleResetPassword}>
                        Reset Password
                    </Text>
                </SettingsSection>
                <SettingsSection title="Dietary Restrictions">
                    {settingsData.dietary.map((item) => (
                        <ToggleSetting
                            key={item.key}
                            label={item.label}
                            value={settings[item.key] || false}
                            onToggle={(value) => updateSetting(item.key, value)}
                        />
                    ))}
                </SettingsSection>

                <SettingsSection title="Data Privacy">
                    {settingsData.privacy.map((item) => (
                        <ToggleSetting
                            key={item.key}
                            label={item.label}
                            value={settings[item.key] || false}
                            onToggle={(value) => updateSetting(item.key, value)}
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

                <Button
                    title="Log Out"
                    containerStyle={styles.buttonContainer}
                    textStyle={styles.buttonText}
                    onPress={handleLogOut}
                />

                <View style={{ height: insets.bottom + 50 }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        marginVertical: 32,
    },
    content: {
        fontFamily: "Nunito",
        padding: 20,
    },
    buttonContainer: {
        display: "flex",
        paddingVertical: 8,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        borderRadius: 25,
        backgroundColor: "#FFCF0F",
        alignSelf: "center",
    },
    buttonText: {
        color: "#000",
        textAlign: "center",
        fontFamily: "Nunito",
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
        fontSize: 14,
        fontFamily: "Nunito",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
    },
    input: {
        fontSize: 14,
        height: 40,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 11,
        paddingHorizontal: 10,
        backgroundColor: "white",
        color: "#000000",
        width: 350,
        flexShrink: 0,
        alignItems: "flex-start",
        fontFamily: "Nunito",
    },
    sectionTitle: {
        fontSize: 20,
        color: "#151619",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: 28,
        fontFamily: "Nunito",
    },
    resetPasswordText: {
        color: "#285852",
        textAlign: "right",
        fontFamily: "Nunito",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
    },
});
