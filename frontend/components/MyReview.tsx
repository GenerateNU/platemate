import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ScrollView,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ProgressBar } from "./ProgressBar";
import { EmojiTagsGrid } from "./EmojiTagsGrid";
import { InteractiveStars } from "./ui/StarReview";
import { createReview } from "@/api/review";
import useAuthStore from "@/auth/store";
import * as ImagePicker from "expo-image-picker";
import { uploadMultipleImagesToS3 } from "@/utils/s3uploads";

interface MyReviewProps {
    restaurantId?: string;
    menuItemName?: string;
    dishImageUrl?: string;
    onClose: () => void;
    onSubmit: () => void;
}

function generateValidObjectId() {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const machineId = Math.floor(Math.random() * 16777216)
        .toString(16)
        .padStart(6, "0");
    const processId = Math.floor(Math.random() * 65536)
        .toString(16)
        .padStart(4, "0");
    const counter = Math.floor(Math.random() * 16777216)
        .toString(16)
        .padStart(6, "0");

    return timestamp + machineId + processId + counter;
}

export function MyReview({ restaurantId, menuItemName, dishImageUrl, onClose, onSubmit }: MyReviewProps) {
    const [step, setStep] = useState(1);
    const user = useAuthStore((state) => state.userId);

    // Track star ratings
    const [tasteRating, setTasteRating] = useState(0);
    const [portionRating, setPortionRating] = useState(0);
    const [valueRating, setValueRating] = useState(0);
    const [overallRating, setOverallRating] = useState(0);
    const [tasteRatingText, setTasteRatingText] = useState("");
    const [portionRatingText, setPortionRatingText] = useState("");
    const [valueRatingText, setValueRatingText] = useState("");
    const [overallText, setOverallText] = useState("");
    const [returnRating, setReturnRating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get the user from Context

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

    // State to store selected images
    const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Sorry, we need camera roll permissions to make this work!");
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImages((prevImages) => [...prevImages, ...result.assets]);
        }
    };

    const handleNext = async () => {
        if (step < 4) {
            // Validate current step before proceeding
            const currentStep = stepContent[step - 1];
            const hasRating = currentStep.rating > 0;
            const hasTags = currentStep.tags.some((tag) => tag.selected);

            if (!hasRating || !hasTags) {
                return;
            }
            setStep((prev) => prev + 1);
        } else {
            // Handle final submission
            try {
                setIsSubmitting(true);

                // Upload images to S3 in parallel using our utility function
                let uploadedImageUrls: string[] = [];
                if (selectedImages.length > 0) {
                    try {
                        uploadedImageUrls = await uploadMultipleImagesToS3(selectedImages);
                    } catch (uploadError) {
                        console.error("Failed to upload images:", uploadError);
                        Alert.alert(
                            "Upload Error",
                            "Some images failed to upload. Would you like to continue with your review?",
                            [
                                { text: "Cancel", style: "cancel" },
                                { text: "Continue", style: "default" },
                            ],
                            { cancelable: false },
                        );
                        // Continue with submission even if images fail
                    }
                }

                // Prepare review data
                const reviewData = {
                    rating: {
                        portion: portionRating,
                        taste: tasteRating,
                        value: valueRating,
                        overall: overallRating,
                        return: overallRating >= 3,
                    },
                    picture: uploadedImageUrls[0] || dishImageUrl || "",
                    content: buildReviewContent(),
                    reviewer: {
                        _id: useAuthStore.getState().userId || "67e300c043b432515e2dd8bb", // Fallback ID
                        pfp: "https://i.pinimg.com/736x/b1/6d/2e/b16d2e5e6a0db39e60ac17d0f1865ef8.jpg",
                        username: "",
                    },
                    menuItem: "64f5a95cc7330b78d33265f2",
                    restaurantId: restaurantId || "64f5a95cc7330b78d33265f1",
                    additionalImages: uploadedImageUrls.slice(1),
                };

                // Submit review
                const response = await createReview(reviewData);
                console.log("Review submitted successfully:", response);
                Alert.alert("Success", "Your review has been submitted!");
                onSubmit();
            } catch (error) {
                console.error("Error submitting review:", error);
                Alert.alert("Error", "Failed to submit review. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Helper function to build review content with tags
    const buildReviewContent = () => {
        // Collect selected tags
        const selectedTasteTags = tasteTags.filter((tag) => tag.selected).map((tag) => tag.text);
        const selectedPortionTags = portionTags.filter((tag) => tag.selected).map((tag) => tag.text);
        const selectedValueTags = valueTags.filter((tag) => tag.selected).map((tag) => tag.text);

        // Build tag description
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
        return overallText + (tagDescription ? "\n\n" + tagDescription : "");
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
                    <View style={styles.imagePreviewContainer}>
                        {selectedImages.map((image, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                                    <IconSymbol name="xmark" color="#FFF" size={16} />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity onPress={pickImage} style={styles.addButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
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

    // Add remove image function
    const removeImage = (index: number) => {
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        step < 4 &&
                            (!stepContent[step - 1].rating ||
                                !stepContent[step - 1].tags.some((tag) => tag.selected)) &&
                            styles.nextButtonDisabled,
                        step === 4 && overallRating === 0 && styles.nextButtonDisabled,
                    ]}
                    onPress={handleNext}
                    disabled={
                        isSubmitting ||
                        (step < 4 &&
                            (!stepContent[step - 1].rating ||
                                !stepContent[step - 1].tags.some((tag) => tag.selected))) ||
                        (step === 4 && overallRating === 0)
                    }>
                    <Text style={styles.nextButtonText}>{step === 4 ? "Submit" : "Next"}</Text>
                </TouchableOpacity>
            </ScrollView>
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
    nextButtonDisabled: {
        backgroundColor: "#E0E0E0",
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Nunito",
    },

    // Image previews and add button
    imagePreviewContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    imageWrapper: {
        position: "relative",
        marginRight: 8,
    },
    removeButton: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    imagePreview: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 8,
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
    },
    addButtonText: {
        fontSize: 24,
        color: "#000",
    },
    scrollContainer: {
        paddingBottom: 40,
    },
});
