import { StyleSheet } from "react-native";

export const sharedOnboardingStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        gap: 16,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        gap: 8,
    },
    headerContainer: {
        marginBottom: 24,
        gap: 4,
    },
    header: {
        fontSize: 22,
        lineHeight: 24,
        fontWeight: "600",
        textAlign: "left",
    },
    subtext: {
        fontSize: 13,
        textAlign: "left",
        opacity: 0.7,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        fontSize: 13,
        color: "#000000",
    },
    button: {
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFCF0F",
    },
    buttonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "600",
    },
    inputContainer: {
        gap: 16,
        marginBottom: 24,
    },
    linkContainer: {
        paddingBottom: 60,
        marginTop: -60,
    },
    linkContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    linkText: {
        fontSize: 13,
    },
    backButton: {
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 1,
        padding: 8,
    },
});
