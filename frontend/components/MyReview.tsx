import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { IconSymbol } from "../components/ui/IconSymbol";
import { ProgressBar } from "./ProgressBar";
import { EmojiTagsGrid } from "./EmojiTagsGrid";

// Example star-rating component placeholder
function StarRating({ rating, onChange }: { rating: number; onChange: (value: number) => void }) {
    const stars = [1, 2, 3, 4, 5];
    return (
        <View style={styles.starRow}>
            {stars.map((star) => (
                <TouchableOpacity key={star} onPress={() => onChange(star)}>
                    <IconSymbol
                        name="chevron.right" // TEMP: Replace with an actual star icon or SFSymbol
                        size={24}
                        color={star <= rating ? "#FFD700" : "#D9D9D9"}
                        style={styles.starIcon}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
}

export function MyReview() {
    const [step, setStep] = useState(1);

    // Track star ratings
    const [tasteRating, setTasteRating] = useState(0);
    const [portionRating, setPortionRating] = useState(0);
    const [valueRating, setValueRating] = useState(0);
    const [overallText, setOverallText] = useState("");

    // Example tag data for taste/portion/value
    const [tasteTags, setTasteTags] = useState([
        { id: "t1", emoji: "🌶️", text: "Spicy", selected: false },
        { id: "t2", emoji: "🧂", text: "Salty", selected: false },
        { id: "t3", emoji: "🧀", text: "Cheesy", selected: false },
        { id: "t4", emoji: "🍯", text: "Sweet", selected: false },
    ]);

    const [portionTags, setPortionTags] = useState([
        { id: "p1", emoji: "🥹", text: "Too small", selected: false },
        { id: "p2", emoji: "🤏", text: "Could be bigger", selected: false },
        { id: "p3", emoji: "🫃", text: "Filling", selected: false },
        { id: "p4", emoji: "😵", text: "Huge!", selected: false },
    ]);

    const [valueTags, setValueTags] = useState([
        { id: "v1", emoji: "💰", text: "Expensive", selected: false },
        { id: "v2", emoji: "😐", text: "Ok price", selected: false },
        { id: "v3", emoji: "🤑", text: "Great deal", selected: false },
    ]);

    // Update selected state for a given tag array
    const toggleTagSelected = (
        tags: typeof tasteTags,
        setTags: React.Dispatch<React.SetStateAction<typeof tasteTags>>,
        id: string
    ) => {
        setTags(
            tags.map((tag) => {
                if (tag.id === id) {
                    return { ...tag, selected: !tag.selected };
                }
                return tag;
            })
        );
    };

    // Adjust progress based on current step
    const getProgressValue = () => {
        switch (step) {
            case 1:
                return 25;
            case 2:
                return 50;
            case 3:
                return 75;
            case 4:
                return 100;
            default:
                return 25;
        }
    };

    const handleNext = () => {
        if (step < 4) {
            setStep((prev) => prev + 1);
        } else {
            // Submit logic here
            console.log("Submit review!");
        }
    };

    const handleBack = () => {
        // Placeholder navigation back action
        // In your app, you might do something like:
        // navigation.goBack();
        console.log("Go back pressed!");
    };

    const renderStep = () => {
        if (step === 1) {
            return (
                <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>How was the taste?</Text>
                    <StarRating rating={tasteRating} onChange={setTasteRating} />
                    <EmojiTagsGrid
                        tags={tasteTags}
                        onTagPress={(id) => toggleTagSelected(tasteTags, setTasteTags, id)}
                    />
                </View>
            );
        } else if (step === 2) {
            return (
                <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>How was the portion?</Text>
                    <StarRating rating={portionRating} onChange={setPortionRating} />
                    <EmojiTagsGrid
                        tags={portionTags}
                        onTagPress={(id) => toggleTagSelected(portionTags, setPortionTags, id)}
                    />
                </View>
            );
        } else if (step === 3) {
            return (
                <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>How was the value?</Text>
                    <StarRating rating={valueRating} onChange={setValueRating} />
                    <EmojiTagsGrid
                        tags={valueTags}
                        onTagPress={(id) => toggleTagSelected(valueTags, setValueTags, id)}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>Overall rating or feedback?</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Let others know what you thought..."
                        value={overallText}
                        onChangeText={setOverallText}
                        multiline
                    />
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with back chevron and title */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <IconSymbol name="chevron.left" color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Review</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <ProgressBar progress={getProgressValue()} />
            </View>

            {/* Dish image centered */}
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: "https://s3-alpha-sig.figma.com/img/296c/9b5f/e826d9e1747de9010166f3934746adf1?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=tWwsc0gbL-fRy7HRvoDFlUj9SLvS8EN0adQdGd2lZhLNVnyDRH49VezfgfiKO37YJYa80RhBVB14KBqCI4Sz7XaYDoe-6cz3wbzLIoB7Cd-lBaxxGQrA2QZv7zKLGeWU19Pu7qiVamUQWz4odayUWme3~68I3-uD8xFvvrTEZzKwbAnKneaeduoX7tqCalDPs5v9S0or7bYw~85sfTmknQ8vDkkhEVLO0b2cbxDXMbp~9Iek2v72ZIHRLHLNn2qxxnr4VEqrdAAqohd1f0pIZN6Vvz3yUAU8UXzLFcJk2MWJu5897Os7HkjymHNN0Grcrj09rhd~UC0RkLbdAOEXxw__",
                    }}
                    style={styles.dishImage}
                />
            </View>

            {/* Step-specific content */}
            {renderStep()}

            {/* Next / Submit button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>{step === 4 ? "Submit" : "Next"}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 8,
    },
    progressContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    imageContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    dishImage: {
        width: 200,
        height: 200,
        borderRadius: 8,
        resizeMode: "cover",
    },
    stepContainer: {
        marginBottom: 24,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    starRow: {
        flexDirection: "row",
        marginBottom: 16,
    },
    starIcon: {
        marginRight: 8,
    },
    textInput: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        textAlignVertical: "top",
    },
    nextButton: {
        backgroundColor: "#FFCF0F",
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 16,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});
