import React from "react";
import { ScrollView, View } from "react-native";
import AccountSettings, { AccountSettingsProps, UserCredentials } from "../../components/AccountSettings";

const ProfileScreen = () => {
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
        pescatarian: false,
        keto: false,
        diabetic: false,
        soyFree: true,
        kosher: false,
        halal: false,
        pork-free: false,
        beef-free: false,
        cameraAccess: true,
        contactSync: false,
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 1 }}>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
export default ProfileScreen;
