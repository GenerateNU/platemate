import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SearchBox } from "@/components/SearchBox";
import SearchIcon from "@/assets/icons/search.svg";
import UserInfoRowBase from "@/components/UserInfo/UserInfoRowBase";
import { EmojiTag } from "@/components/EmojiTag";
import { ProgressBar } from "@/components/ProgressBar";


type Props = {};

const ReviewFlow = (props: Props) => {
    const [searchText, setSearchText] = React.useState("");
    const [isAvocadoSelected, setAvocadoSelected] = useState(false);
    const [isTomatoSelected, setTomatoSelected] = useState(false);

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={{ fontWeight: "700" }}>
                Review Flow
            </ThemedText>
            <ScrollView contentContainerStyle={{ gap: 16 }}>
                <SearchBox
                    icon={<SearchIcon />}
                    placeholder={"What are you hungry for?"}
                    recent={true}
                    name={"general"}
                    onSubmit={() => console.log("submit")}
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <EmojiTag
                        emoji="🥑"
                        text="Creamy"
                        selected={isAvocadoSelected}
                        onPress={() => setAvocadoSelected(!isAvocadoSelected)}
                    />

                    <EmojiTag
                        emoji="🍅"
                        text="Juicy"
                        selected={isTomatoSelected}
                        onPress={() => setTomatoSelected(!isTomatoSelected)}
                    />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <ProgressBar progress={25} />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <ProgressBar progress={50} />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <ProgressBar progress={75} />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <ProgressBar progress={100} />
                </View>
                {/* <SearchBox value={""} onChangeText={() => {}} onSubmit={() => {}} icon={<Text>🔍</Text>} /> */}
            </ScrollView>
        </ThemedView>
    );
};

export default ReviewFlow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: Dimensions.get("window").height * 0.12,
        gap: 16,
    },
    cardContainer: { padding: 24, borderWidth: 1, borderColor: "#DDD", borderRadius: 12 },
});
