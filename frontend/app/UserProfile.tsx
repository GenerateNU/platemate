import { useAuth } from "@/providers/AuthProvider";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
    Dimensions,
    Image,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Pressable,
    SafeAreaView,
    Platform,
    StatusBar,
} from "react-native";
import { useGetUserById } from "@/hooks/useGetUserById";
import { useState } from "react";

const UserProfile = () => {
    const { userId, email } = useAuth();
    const { user } = useGetUserById(userId);

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{
                    uri:
                        user?.profile_picture ||
                        "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
                }}
                style={styles.avatar}
            />
            <ThemedText>
                User ID: {userId} {"\n"}
                Email: {email} {"\n"}
                User Data: {JSON.stringify(user, null, 2)}
            </ThemedText>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: "#fff",
    },
    container: {
        padding: 24,
        marginVertical: 32,
    },
});

export default UserProfile;
