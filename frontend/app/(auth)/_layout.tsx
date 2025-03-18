import { Stack } from "expo-router";
export default function RegisterLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="register" />
        </Stack>
    );
}
