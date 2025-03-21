import { StyleSheet, Switch, Text, View } from "react-native";

type ToggleSettingProps = {
    label: string;
    value: boolean;
    onToggle: (value: boolean) => void;
};

const ToggleSetting = (props: ToggleSettingProps) => {
    return (
        <View style={styles.settingItem}>
            <View>
                <Text style={styles.settingLabel}>{props.label}</Text>
                <Text style={styles.settingDescription}>{props.value ? "Enabled" : "Disabled"}</Text>
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#F7B418" }}
                thumbColor={props.value ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={props.onToggle}
                value={props.value}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#151619",
        fontFamily: "Outfit",
    },
    settingDescription: {
        fontSize: 13,
        color: "#727272",
        marginTop: 2,
        fontFamily: "Outfit",
    },
});

export default ToggleSetting;
