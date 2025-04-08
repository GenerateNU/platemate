import { Text } from "react-native";
import { Redirect, Slot } from "expo-router";
import useAuthStore from "@/auth/store";

export default function AppLayout() {
    const { isAuthenticated, loading } = useAuthStore();

    // You can keep the splash screen open, or render a loading screen like we do here.
    if (loading) {
        return <Text>Loading...</Text>;
    }

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!isAuthenticated) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        return <Redirect href="/(onboarding)" />;
    }

    // This layout can be deferred because it's not the root layout.
    return <Slot />;
}
