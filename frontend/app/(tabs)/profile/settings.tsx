"use client";

import { ScrollView, View, StyleSheet, TextInput, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import ToggleSetting from "@/components/profile/settings/ToggleSetting";
import SettingsSection from "@/components/profile/settings/SettingsSection";
import SettingsMenuItem from "@/components/profile/settings/SettingsMenuItem";
import { TSettingsData } from "@/types/settingsData";
import { Button } from "@/components/Button";
import useAuthStore from "@/auth/store";

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
        porkFree: false,
        beefFree: false,
    });

    const { email } = useAuthStore();

    const updateSetting = (key: string, value: boolean) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            [key]: value,
        }));
    };

    const settingsData: TSettingsData = {
        credentials: [
            { key: "accountEmail", label: "Email" },
            { key: "accountPassword", label: "Password" }
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

                <Button title="Log Out" containerStyle={styles.buttonContainer} textStyle={styles.buttonText} />

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
        backgroundColor: "#285852",
        alignSelf: "center",
        width: 100,
        height: 30,
    },
    buttonText: {
        color: "#FFF",
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
    }
}
);
