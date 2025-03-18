// components/PersistentHeader.tsx
import { View, Text, StyleSheet } from "react-native";

const StatusBarHeader = () => {
    return <View style={styles.header} />;
};

const styles = StyleSheet.create({
    header: {
        height: 50,
        backgroundColor: "#f8f8f8",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
});

export default StatusBarHeader;
