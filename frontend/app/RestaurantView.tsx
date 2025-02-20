import { ThemedView } from "@/components/ThemedView";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export default function RestaurantView({}) {
    return (
        <>
            <View style={styles.bannerContainer}>
                <Image
                    source={{
                        uri: "https://png.pngtree.com/thumb_back/fw800/background/20240724/pngtree-thai-stir-fried-noodles-with-shrimps-and-egg-wrap-pad-thai-image_15912377.jpg",
                    }}
                    style={styles.bannerImage}
                />
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: "https://media-cdn.tripadvisor.com/media/photo-p/12/4c/95/45/logo.jpg" }}
                        style={styles.avatar}
                    />
                </View>
            </View>
            <ThemedView style={styles.container}>
                <ThemedText>Wowzas</ThemedText>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    bannerContainer: {
        width: "100%",
        position: "relative",
        alignItems: "flex-start",
        backgroundColor: "white",
    },
    bannerImage: {
        width: "100%",
        height: 190,
    },
    avatarContainer: {
        position: "absolute",
        bottom: -50,
        left: 20,
        zIndex: 1,
    },
    avatar: {
        width: 144,
        height: 144,
        borderRadius: 72,
        borderWidth: 3,
        borderColor: "white",
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 96,
        marginTop: -30,
        backgroundColor: "white",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
});
