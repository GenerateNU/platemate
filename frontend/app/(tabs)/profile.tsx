import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import AccountSettings, { AccountSettingsProps, UserCredentials } from "../../components/AccountSettings";
import { OnboardingFlow } from "../../components/Onboarding/OnboardingFlow";
import { Button } from "../../components/Button";

const ProfileScreen = () => {
    const [showOnboarding, setShowOnboarding] = useState(false);

    const credentials: UserCredentials = {
        email: "dannyrollo@gmail.com",
        password: "ilovegenerate",
    };

    const userSettings: AccountSettingsProps = {
        credentials: credentials,
        vegetarian: true,
        vegan: false,
        nutFree: true,
        shellfishAllergy: false,
        glutenFree: false,
        dairyFree: true,
        kosher: false,
        halal: false,
        pescatarian: false,
        keto: false,
        diabetic: false,
        soyFree: true,
        cameraAccess: true,
        contactSync: false,
    };

    const handleOnboardingComplete = (data: any) => {
        console.log("Onboarding completed:", data);
        setShowOnboarding(false);
    };

    if (showOnboarding) {
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 1 }}>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <View style={styles.header}>
                    <Button
                        title="Start Onboarding"
                        onPress={() => setShowOnboarding(true)}
                        containerStyle={styles.onboardingButton}
                    />
                </View>
                <AccountSettings
                    credentials={userSettings.credentials}
                    vegetarian={userSettings.vegetarian}
                    vegan={userSettings.vegan}
                    nutFree={userSettings.nutFree}
                    shellfishAllergy={userSettings.shellfishAllergy}
                    glutenFree={userSettings.glutenFree}
                    dairyFree={userSettings.dairyFree}
                    kosher={userSettings.kosher}
                    halal={userSettings.halal}
                    pescatarian={userSettings.pescatarian}
                    keto={userSettings.keto}
                    diabetic={userSettings.diabetic}
                    soyFree={userSettings.soyFree}
                    cameraAccess={userSettings.cameraAccess}
                    contactSync={userSettings.contactSync}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginTop: 32,
    },
    onboardingButton: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
});

export default ProfileScreen;
