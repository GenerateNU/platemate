import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SearchBox } from "@/components/SearchBox";
import SearchIcon from "@/assets/icons/search.svg";
import UserInfoRowBase from "@/components/UserInfo/UserInfoRowBase";
import { RestaurantTags } from "@/components/RestaurantTags";
import { StarReview } from "@/components/StarReview";
import { MenuItemCard } from "@/components/MenuItemCard";


type Props = {};

const Dev1 = (props: Props) => {
    const [searchText, setSearchText] = React.useState("");
    const restaurantTags = ["Italian", "Vegan", "Family-friendly", "Gluten-free"]; // Example tags

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
                {/* <SearchBox value={""} onChangeText={() => {}} onSubmit={() => {}} icon={<Text>🔍</Text>} /> */}
                <ThemedView>
                <RestaurantTags tags={restaurantTags} />
                </ThemedView>
                <ThemedView>
                    <StarReview avgRating={1.9} numRatings={500} full={false} />
                </ThemedView>
                <ThemedView>
                    <MenuItemCard name={"Pad Thai"} image={"https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg"} starReview={{ avgRating: 3.5, numRatings: 100, full: false }} /> 
                </ThemedView>
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
