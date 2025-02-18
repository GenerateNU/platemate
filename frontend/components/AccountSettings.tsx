import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import ToggleOff from "@/assets/icons/toggle_off.svg";
import ToggleOn from "@/assets/icons/toggle_on.svg"

export interface UserCredentials {
    email?: string;
    password?: string;
}
export interface AccountSettingsProps {
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
    cameraAccess?: boolean;
    contactSync?: boolean;
}

const AccountSettings = (credentials: UserCredentials, settings: AccountSettingsProps) => {
    const {email, password} = credentials;
    const {vegetarian, vegan, nutFree, shellfishAllergy, glutenFree, dairyFree, kosher, halal, pescatarian, keto, diabetic, soyFree, cameraAccess, contactSync} = settings;

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
    
    return (
        <View style={styles.container}>
            <View style={styles.settingsHeader}>
                <Text style={styles.settingsHeaderText}>{"< Settings"}</Text>
            </View>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="dannyrollo@gmail.com"
                    value={email}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="*****"
                    value={password}
                    secureTextEntry
                />
            </View>

            <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
            <View style={styles.togglesContainer}>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Vegetarian{"\n"}<Text style={styles.toggleDescription}>{vegetarianValue ? "on" : "off"}</Text></Text>
                    <Toggle value={vegetarianValue} onValueChange={newValue => setVegetarianValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Vegan{"\n"}<Text style={styles.toggleDescription}>{veganValue ? "on" : "off"}</Text></Text>
                    <Toggle value={veganValue} onValueChange={newValue => setVeganValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Nut-free{"\n"}<Text style={styles.toggleDescription}>{nutFreeValue ? "on" : "off"}</Text></Text>
                    <Toggle value={nutFreeValue} onValueChange={newValue => setNutFreeValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Shellfish allergy{"\n"}<Text style={styles.toggleDescription}>{shellfishAllergyValue ? "on" : "off"}</Text></Text>
                    <Toggle value={shellfishAllergyValue} onValueChange={newValue => setShellfishAllergyValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Gluten-free{"\n"}<Text style={styles.toggleDescription}>{glutenFreeValue ? "on" : "off"}</Text></Text>
                    <Toggle value={glutenFreeValue} onValueChange={newValue => setGlutenFreeValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Dairy-free{"\n"}<Text style={styles.toggleDescription}>{dairyFreeValue ? "on" : "off"}</Text></Text>
                    <Toggle value={dairyFreeValue} onValueChange={newValue => setDairyFreeValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Kosher{"\n"}<Text style={styles.toggleDescription}>{kosherValue ? "on" : "off"}</Text></Text>
                    <Toggle value={kosherValue} onValueChange={newValue => setKosherValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Halal{"\n"}<Text style={styles.toggleDescription}>{halalValue ? "on" : "off"}</Text></Text>
                    <Toggle value={halalValue} onValueChange={newValue => setHalalValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Pescatarian{"\n"}<Text style={styles.toggleDescription}>{pescatarianValue ? "on" : "off"}</Text></Text>
                    <Toggle value={pescatarianValue} onValueChange={newValue => setPescatarianValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Keto{"\n"}<Text style={styles.toggleDescription}>{ketoValue ? "on" : "off"}</Text></Text>
                    <Toggle value={ketoValue} onValueChange={newValue => setKetoValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Diabetic{"\n"}<Text style={styles.toggleDescription}>{diabeticValue ? "on" : "off"}</Text></Text>
                    <Toggle value={diabeticValue} onValueChange={newValue => setDiabeticValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Soy-free{"\n"}<Text style={styles.toggleDescription}>{soyFreeValue ? "on" : "off"}</Text></Text>
                    <Toggle value={soyFreeValue} onValueChange={newValue => setSoyFreeValue(newValue)} />
                </View>

                <Text style={styles.sectionTitle}>Data Privacy</Text>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Camera access{"\n"}<Text style={styles.toggleDescription}>{cameraAccessValue ? "on" : "off"}</Text></Text>
                    <Toggle value={cameraAccessValue} onValueChange={newValue => setCameraAccessValue(newValue)} />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Contact sync{"\n"}<Text style={styles.toggleDescription}>{contactSyncValue ? "on" : "off"}</Text></Text>
                    <Toggle value={contactSyncValue} onValueChange={newValue => setContactSyncValue(newValue)} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    settingsHeader: {
        paddingVertical: 10,
        width: 267,
        height: 27,
        flexShrink: 0,
    },
    settingsHeaderText: {
        fontSize: 28,
        color: "#151619",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: 28,
        fontFamily: "Inter"
    },
    sectionTitle: {
        fontSize: 20,
        color: "#151619",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: 28,
        fontFamily: "Inter"
    },
    inputContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "stretch",
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 10,
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
        marginBottom: 5,
    },
    // to be changed later
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    togglesContainer: {
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginBottom: 10,
    },
    toggleLabel: {
        fontSize: 16,
        color: "#000000",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
        fontFamily: "Inter"
    },
    toggleDescription: {
        fontSize: 12,
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: 28,
        color: "#727272",
    }
});

export default AccountSettings;