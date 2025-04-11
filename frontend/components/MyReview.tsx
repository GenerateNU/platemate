import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ProgressBar } from "./ProgressBar";
import { EmojiTagsGrid } from "./EmojiTagsGrid";
import { InteractiveStars } from "./ui/StarReview";
import { createReview } from "@/api/review";
import useAuthStore from "@/auth/store";

interface MyReviewProps {
    restaurantId: string;
    restaurantName: string;
    menuItemId: string;
    menuItemName: string;
    dishImageUrl?: string;
    onClose: () => void;
}

export function MyReview({
    restaurantId,
    restaurantName,
    menuItemId,
    menuItemName,
    dishImageUrl,
    onClose,
}: MyReviewProps) {
    const [step, setStep] = useState(1);
    const userId = useAuthStore((state) => state.userId);

    // Track star ratings
    const [tasteRating, setTasteRating] = useState(0);
    const [portionRating, setPortionRating] = useState(0);
    const [valueRating, setValueRating] = useState(0);
    const [overallRating, setOverallRating] = useState(0);
    const [overallText, setOverallText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        id: string,
    ) => {
        setTags(
            tags.map((tag) => {
                if (tag.id === id) {
                    return { ...tag, selected: !tag.selected };
                }
                return tag;
            }),
        );
    };

    // Adjust progress based on current step
    const getProgressValue = (): 25 | 50 | 75 | 100 => {
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

    const handleNext = async () => {
        if (step < 4) {
            setStep((prev) => prev + 1);
        } else {
            try {
                setIsSubmitting(true);

                // Ensure we have a valid user ID
                if (!userId) {
                    Alert.alert("Error", "You must be logged in to submit a review");
                    return;
                }

                // Collect all the selected tags
                const selectedTasteTags = tasteTags.filter((tag) => tag.selected).map((tag) => tag.text);
                const selectedPortionTags = portionTags.filter((tag) => tag.selected).map((tag) => tag.text);
                const selectedValueTags = valueTags.filter((tag) => tag.selected).map((tag) => tag.text);

                // Combine tags for content enhancement
                let tagDescription = "";
                if (selectedTasteTags.length > 0) {
                    tagDescription += `Taste: ${selectedTasteTags.join(", ")}. `;
                }
                if (selectedPortionTags.length > 0) {
                    tagDescription += `Portion: ${selectedPortionTags.join(", ")}. `;
                }
                if (selectedValueTags.length > 0) {
                    tagDescription += `Value: ${selectedValueTags.join(", ")}. `;
                }

                // Combine user text with tags
                const finalContent = overallText + (tagDescription ? "\n\n" + tagDescription : "");

                // Create review payload with valid ObjectIds - matching backend API structure
                const reviewData = {
                    rating: {
                        portion: portionRating,
                        taste: tasteRating,
                        value: valueRating,
                        overall: overallRating,
                        return: overallRating >= 3,
                    },
                    picture:
                        dishImageUrl ||
                        "https://plus.unsplash.com/premium_photo-1661771822467-e516ca075314?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
                    content: finalContent,
                    reviewer: {
                        _id: userId,
                        pfp: "https://i.pinimg.com/736x/b1/6d/2e/b16d2e5e6a0db39e60ac17d0f1865ef8.jpg",
                        username: "",
                    },
                    menuItem: menuItemId,
                    restaurantId: restaurantId,
                    menuItemName: menuItemName,
                    restaurantName: restaurantName,
                };

                console.log("Submitting review:", JSON.stringify(reviewData));

                await createReview(reviewData);
                Alert.alert("Success", "Your review has been submitted!");
                onClose();
            } catch (error) {
                // ... error handling (keep as is)
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        //console.log("Go back pressed!");
        if (step > 1) {
            setStep((prev) => prev - 1);
        } else {
            if (onClose && typeof onClose === "function") {
                onClose();
            }
        }
    };
    // Step content configuration
    const stepContent = [
        {
            title: "How was the taste?",
            rating: tasteRating,
            setRating: setTasteRating,
            tags: tasteTags,
            setTags: setTasteTags,
        },
        {
            title: "How was the portion?",
            rating: portionRating,
            setRating: setPortionRating,
            tags: portionTags,
            setTags: setPortionTags,
        },
        {
            title: "How was the value?",
            rating: valueRating,
            setRating: setValueRating,
            tags: valueTags,
            setTags: setValueTags,
        },
    ];

    const renderStep = () => {
        // Final step (text input)
        if (step === 4) {
            return (
                <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>Overall rating or feedback?</Text>
                    <View style={styles.starsContainer}>
                        <InteractiveStars rating={overallRating} onChange={setOverallRating} />
                    </View>
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

        // Rating steps (1-3)
        const currentStep = stepContent[step - 1];
        return (
            <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>{currentStep.title}</Text>
                <View style={styles.starsContainer}>
                    <InteractiveStars rating={currentStep.rating} onChange={currentStep.setRating} />
                </View>
                <View style={styles.tagsContainer}>
                    <EmojiTagsGrid
                        tags={currentStep.tags}
                        onTagPress={(id) => toggleTagSelected(currentStep.tags, currentStep.setTags, id)}
                    />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with back chevron and title */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
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
                        uri:
                            dishImageUrl ||
                            "https://s3-alpha-sig.figma.com/img/296c/9b5f/e826d9e1747de9010166f3934746adf1?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Gr9ywhylTdZqfzVKJYh1XvcRQk9wD284~bcNy-jZ15dxG~abTxWe9CrFEfy5CvDSwyFzlPcuSGBY7PB5xzJbA67Ig36cXUffXxCUsn6oJiJ~JJihfCY55QE3eS22DaPB2ZJ1cMI7vTQ5duqrA0gEf3fwEQxzGY9heTjrUEBZVg81XezecvSY6II2GDHix~W80NbpDKn9ecJlBcld08Z38-a5aB7XN~YtUKnKMsH2r5CLmT4mej6avtZsgaTnR3zb2V1I1XlRv57siEvNj03TWjnvwrjXMdgsrO4tHXn-UxQmMp~qHUBCebvxMBGTBFR-hFnmHwaIu8W2tp0CnLkMaA__",
                    }}
                    style={styles.dishImage}
                />
            </View>

            {/* Step-specific content */}
            {renderStep()}

            {/* Next / Submit button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={isSubmitting}>
                <Text style={styles.nextButtonText}>{step === 4 ? "Submit" : "Next"}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Base container
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },

    // Header styling
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        marginBottom: 8,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Nunito",
    },

    // Progress bar
    progressContainer: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },

    // Food image
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

    // Step content containers
    stepContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    stepTitle: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
        fontFamily: "Nunito",
    },
    starsContainer: {
        paddingVertical: 20,
        marginBottom: 16,
    },
    tagsContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#dfdfdf",
        alignItems: "center",
        marginBottom: 16,
    },

    // Text input for final step
    textInput: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        minHeight: 120,
        textAlignVertical: "top",
        fontFamily: "Nunito",
    },

    // Action button
    nextButton: {
        backgroundColor: "#FFCF0F",
        borderRadius: 20,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginVertical: 24,
        alignItems: "center",
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Nunito",
    },
});
