import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from "react-native";
import ToggleOff from "@/assets/icons/toggle_off.svg";
import ToggleOn from "@/assets/icons/toggle_on.svg";

export interface UserCredentials {
    email?: string;
    password?: string;
}
export interface AccountSettingsProps {
    credentials?: UserCredentials;
    vegetarian?: boolean;
    vegan?: boolean;
    nutFree?: boolean;
    shellfishAllergy?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
    kosher?: boolean;
    halal?: boolean;
    pescatarian?: boolean;
    keto?: boolean;
    diabetic?: boolean;
    soyFree?: boolean;
    porkFree?: boolean;
    beefFree?: boolean;
    cameraAccess?: boolean;
    contactSync?: boolean;
}

interface ToggleOptionProps {
    label: string;
    value: boolean;
    onValueChange: (newValue: boolean) => void;
}

const AccountSettings = ({
    credentials,
    vegetarian,
    vegan,
    nutFree,
    shellfishAllergy,
    glutenFree,
    dairyFree,
    kosher,
    halal,
    pescatarian,
    keto,
    diabetic,
    soyFree,
    porkFree,
    beefFree,
    cameraAccess,
    contactSync,
}: AccountSettingsProps) => {
    const [vegetarianValue, setVegetarianValue] = useState(vegetarian || false);
    const [veganValue, setVeganValue] = useState(vegan || false);
    const [nutFreeValue, setNutFreeValue] = useState(nutFree || false);
    const [shellfishAllergyValue, setShellfishAllergyValue] = useState(shellfishAllergy || false);
    const [glutenFreeValue, setGlutenFreeValue] = useState(glutenFree || false);
    const [dairyFreeValue, setDairyFreeValue] = useState(dairyFree || false);
    const [kosherValue, setKosherValue] = useState(kosher || false);
    const [halalValue, setHalalValue] = useState(halal || false);
    const [pescatarianValue, setPescatarianValue] = useState(pescatarian || false);
    const [ketoValue, setKetoValue] = useState(keto || false);
    const [diabeticValue, setDiabeticValue] = useState(diabetic || false);
    const [soyFreeValue, setSoyFreeValue] = useState(soyFree || false);
    const [porkFreeValue, setPortFreeValue] = useState(porkFree || false);
    const [beefFreeValue, setBeefFreeValue] = useState(beefFree || false);
    const [cameraAccessValue, setCameraAccessValue] = useState(cameraAccess || false);
    const [contactSyncValue, setContactSyncValue] = useState(contactSync || false);

    // combining the toggle on and toggle off
    const Toggle = ({ value, onValueChange }: { value: boolean; onValueChange: (newValue: boolean) => void }) => {
        return (
            <TouchableOpacity onPress={() => onValueChange(!value)}>
                {value ? <ToggleOn width={40} height={24} /> : <ToggleOff width={40} height={24} />}
            </TouchableOpacity>
        );
    };
      
    const ToggleOption: React.FC<ToggleOptionProps> = ({ label, value, onValueChange }) => {
    return (
        <View style={styles.toggleContainer}>
        <View style={styles.toggleContentContainer}>
            <Text style={styles.toggleLabel}>
            {label}{"\n"}
            <Text style={styles.toggleDescription}>{value ? "on" : "off"}</Text>
            </Text>
            <Toggle value={value} onValueChange={onValueChange} />
        </View>
        </View>
    );
    };

    return (
        <View style={styles.container}>
            <View style={styles.settingsHeader}>
                <Text style={styles.settingsHeaderText}>{"Settings"}</Text>
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.accountContainer}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.emailPasswordContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput style={styles.input} value={credentials?.email} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput style={styles.input} value={credentials?.password} secureTextEntry />
                        </View>
                    </View>
                </View>
                <View style={styles.toggleSectionContainer}>
                    <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
                    <View style={styles.togglesContainer}>
                        <ToggleOption label="Vegetarian" value={vegetarianValue} onValueChange={setVegetarianValue} />
                        <ToggleOption label="Vegan" value={veganValue} onValueChange={setVeganValue} />
                        <ToggleOption label="Nut-free" value={nutFreeValue} onValueChange={setNutFreeValue} />
                        <ToggleOption label="Shellfish allergy" value={shellfishAllergyValue} onValueChange={setShellfishAllergyValue} />
                        <ToggleOption label="Gluten-free" value={glutenFreeValue} onValueChange={setGlutenFreeValue} />
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleContentContainer}>
                                <Text style={styles.toggleLabel}>
                                    Gluten-free{"\n"}
                                    <Text style={styles.toggleDescription}>{glutenFreeValue ? "on" : "off"}</Text>
                                </Text>
                                <Toggle
                                    value={glutenFreeValue}
                                    onValueChange={(newValue) => setGlutenFreeValue(newValue)}
                                />
                            </View>
                        </View>
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleContentContainer}>
                                <Text style={styles.toggleLabel}>
                                    Dairy-free{"\n"}
                                    <Text style={styles.toggleDescription}>{dairyFreeValue ? "on" : "off"}</Text>
                                </Text>
                                <Toggle
                                    value={dairyFreeValue}
                                    onValueChange={(newValue) => setDairyFreeValue(newValue)}
                                />
                            </View>
                        </View>
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleContentContainer}>
                                <Text style={styles.toggleLabel}>
                                    Kosher{"\n"}
                                    <Text style={styles.toggleDescription}>{kosherValue ? "on" : "off"}</Text>
                                </Text>
                                <Toggle value={kosherValue} onValueChange={(newValue) => setKosherValue(newValue)} />
                            </View>
                        </View>
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleContentContainer}>
                                <Text style={styles.toggleLabel}>
                                    Halal{"\n"}
                                    <Text style={styles.toggleDescription}>{halalValue ? "on" : "off"}</Text>
                                </Text>
                                <Toggle value={halalValue} onValueChange={(newValue) => setHalalValue(newValue)} />
                            </View>
                        </View>
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleContentContainer}>
                                <Text style={styles.toggleLabel}>
                                    Pescatarian{"\n"}
                                    <Text style={styles.toggleDescription}>{pescatarianValue ? "on" : "off"}</Text>
                                </Text>
                                <Toggle
                                    value={pescatarianValue}
                                    onValueChange={(newValue) => setPescatarianValue(newValue)}
                                />
                            </View>
                        </View>
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleContentContainer}>
                                <Text style={styles.toggleLabel}>
                                    Keto{"\n"}
                                    <Text style={styles.toggleDescription}>{ketoValue ? "on" : "off"}</Text>
                                </Text>
                                <Toggle value={ketoValue} onValueChange={(newValue) => setKetoValue(newValue)} />
                            </View>
                        </View>
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleContentContainer}>
                                <Text style={styles.toggleLabel}>
                                    Diabetic{"\n"}
                                    <Text style={styles.toggleDescription}>{diabeticValue ? "on" : "off"}</Text>
                                </Text>
                                <Toggle
                                    value={diabeticValue}
                                    onValueChange={(newValue) => setDiabeticValue(newValue)}
                                />
                            </View>
                        </View>
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleContentContainer}>
                                <Text style={styles.toggleLabel}>
                                    Soy Free{"\n"}
                                    <Text style={styles.toggleDescription}>{soyFreeValue ? "on" : "off"}</Text>
                                </Text>
                                <Toggle value={soyFreeValue} onValueChange={(newValue) => setSoyFreeValue(newValue)} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.dataPrivacyContainer}>
                        <Text style={styles.sectionTitle}>Data Privacy</Text>
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleContentContainer}>
                                <Text style={styles.toggleLabel}>
                                    Camera Access{"\n"}
                                    <Text style={styles.toggleDescription}>{cameraAccessValue ? "on" : "off"}</Text>
                                </Text>
                                <Toggle
                                    value={cameraAccessValue}
                                    onValueChange={(newValue) => setCameraAccessValue(newValue)}
                                />
                            </View>
                        </View>
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleContentContainer}>
                                <Text style={styles.toggleLabel}>
                                    Contact Sync{"\n"}
                                    <Text style={styles.toggleDescription}>{contactSyncValue ? "on" : "off"}</Text>
                                </Text>
                                <Toggle
                                    value={contactSyncValue}
                                    onValueChange={(newValue) => setContactSyncValue(newValue)}
                                />
                            </View>
                        </View>
                        <View style={styles.extraSettingsContainer}>
                            <View style={styles.emailPasswordContainer}>
                                <View style={styles.inputContainer}>
                                    <View style={styles.input}>
                                        <Text style={styles.extraSettingsText}>Blocked Users</Text>
                                    </View>
                                </View>
                                <View style={styles.inputContainer}>
                                    <View style={styles.input}>
                                        <Text style={styles.extraSettingsText}>Terms and Conditions</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 10,
        backgroundColor: "#FFFFFF",
        padding: 20,
        paddingTop: Dimensions.get("screen").height * 0.08,
    },
    settingsHeader: {
        paddingVertical: 10,
        width: "100%",
        backgroundColor: "#FFFFFF",
    },
    settingsHeaderText: {
        fontSize: 28,
        color: "#151619",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: 28,
        fontFamily: "Inter",
    },
    sectionContainer: {
        gap: 28,
    },
    sectionTitle: {
        fontSize: 20,
        color: "#151619",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: 28,
        fontFamily: "Inter",
    },
    accountContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "stretch",
    },
    inputContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "#FFFFFF",
        width: 382,
    },
    emailPasswordContainer: {
        gap: 4,
    },
    inputLabel: {
        fontSize: 10,
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
    },
    // to be changed later
    input: {
        fontSize: 12,
        height: 35,
        borderColor: "#D9D9D9",
        borderWidth: 1,
        borderRadius: 11,
        paddingHorizontal: 10,
        backgroundColor: "white",
        color: "#000000",
        width: 328,
        flexShrink: 0,
    },
    toggleSectionContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignSelf: "stretch",
    },
    togglesContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        alignSelf: "stretch",
    },
    toggleContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "stretch",
    },
    toggleContentContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
    },
    toggleLabel: {
        fontSize: 16,
        color: "#000000",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
        fontFamily: "Inter",
    },
    toggleDescription: {
        fontSize: 12,
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
        color: "#727272",
        width: 20,
    },
    dataPrivacyContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "stretch",
    },
    extraSettingsText: {
        fontSize: 12,
        fontFamily: "Inter",
        color: "#151619",
        textAlign: "center",
        width: 328,
        lineHeight: 28,
        fontStyle: "normal",
        fontWeight: 400,
    },
    extraSettingsContainer: {
        display: "flex",
        paddingTop: 7,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        alignSelf: "stretch",
    },
});

export default AccountSettings;
