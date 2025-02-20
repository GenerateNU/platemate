import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SearchBox } from "@/components/SearchBox";
import SearchIcon from "@/assets/icons/search.svg";
import UserInfoRowBase from "@/components/UserInfo/UserInfoRowBase";
import ReviewPreview from "@/components/Cards/ReviewPreview";

type Props = {};

const Dev1 = (props: Props) => {
    const [searchText, setSearchText] = React.useState("");

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={{ fontWeight: "700" }}>
                Development Environment 1
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
                <View style={styles.cardContainer}>
                    <UserInfoRowBase
                        name={"Beak"}
                        username={"beakerboy"}
                        right={<View />}
                        icon={
                            "https://bookstore.gpo.gov/sites/default/files/styles/product_page_image/public/covers/600x96-official_presidential_portrait_of_barack_obama_20x24.jpg?itok=IompvPfM"
                        }
                    />
                </View>
                <ReviewPreview
                    plateName={"Plate 1"}
                    restaurantName={"Restaurant 1"}
                    tags={["tag1", "tag2", "tag3", "tag4"]}
                    rating={4}
                    content={"This is the content of the review."}
                />
                {/* <SearchBox value={""} onChangeText={() => {}} onSubmit={() => {}} icon={<Text>🔍</Text>} /> */}
            </ScrollView>
        </ThemedView>
    );
};

export default Dev1;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: Dimensions.get("window").height * 0.12,
        gap: 16,
    },
    cardContainer: { padding: 24, borderWidth: 1, borderColor: "#DDD", borderRadius: 12 },
});
