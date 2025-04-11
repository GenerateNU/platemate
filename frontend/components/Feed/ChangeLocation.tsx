// import { Dimensions, Image, Text, View, ScrollView } from "react-native";
import { Dimensions, View } from "react-native";
import React from "react";
import { ThemedText } from "../themed/ThemedText";
import Entypo from "@expo/vector-icons/build/Entypo";
import { color } from "bun";
import { SearchBox } from "../SearchBox";
import SearchIcon from "@/assets/icons/search.svg";
import CrossIcon from "@/assets/icons/button.svg";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native";

interface LocationInfo {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

const ChangeLocation = () => {
    const [searchText, setSearchText] = React.useState("");
    const [location, setLocation] = React.useState<LocationInfo>({
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const onSubmit = async () => {
        const apiKey = "AIzaSyA82EmyqRfBPxB1mSNQRjr-gq5oLHqj5vM";
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            searchText,
        )}&key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            const result = data.results[0].geometry.location;

            setLocation({
                latitude: result.lat,
                longitude: result.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        } catch (error) {
            console.error("Error with geocoding request:", error);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center", // Centers the child vertically
                alignItems: "center", // Centers the child horizontally
                backgroundColor: "#f0f0f0", // background color
            }}>
            <View
                style={{
                    flexDirection: "column",
                    width: Dimensions.get("screen").width * 0.9,
                    height: Dimensions.get("screen").height * 0.66,
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 32,
                }}>
                <View // Change Location text and X button
                    style={{
                        alignContent: "flex-start",
                        paddingHorizontal: 16,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: Dimensions.get("screen").height * 0.078,
                        width: "100%",
                    }}>
                    <ThemedText style={{ color: "black", fontSize: 24, fontWeight: "bold", lineHeight: 28 }}>
                        Change Location
                    </ThemedText>
                    <CrossIcon
                        width={24}
                        height={24}
                        style={{
                            borderRadius: 999999, // Makes it a circle
                            backgroundColor: "#DDDDDD",
                        }}
                    />
                </View>

                <View style={{ width: Dimensions.get("screen").width * 0.81, alignContent: "center" }}>
                    <View
                        style={{
                            height: Dimensions.get("screen").height * 0.056,
                        }}>
                        <SearchBox
                            icon={<SearchIcon />}
                            placeholder={"Location"}
                            recent={false} // when recent is true and no recents are displayed a white box is still rendered
                            name={"general"}
                            onSubmit={onSubmit}
                            value={searchText}
                            onChangeText={(text) => setSearchText(text)}
                        />
                    </View>
                    <MapView
                        style={{
                            width: "100%",
                            height: Dimensions.get("screen").height * 0.5,
                            borderRadius: 15,
                            top: 10,
                        }}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: location.latitudeDelta,
                            longitudeDelta: location.longitudeDelta,
                        }}>
                        {/* Example Marker */}
                        <Marker
                            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                            title="Location"
                            description="YURRRRR!"
                        />
                    </MapView>
                </View>
                <View
                    style={{
                        flex: 0,
                        zIndex: 1,
                        width: Dimensions.get("screen").width * 0.28,
                        height: Dimensions.get("screen").height * 0.03,
                        alignItems: "center",
                        backgroundColor: "#FFCF0F",
                        borderRadius: 25,
                        bottom: 20,
                    }}>
                    <ThemedText style={{ fontSize: 14, color: "black", fontWeight: 500 }}>Apply Changes</ThemedText>
                </View>
            </View>
        </View>
    );
};

export default ChangeLocation;
// screen height: 846 px
// screen width: 396 px
