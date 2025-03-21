import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { ThemedText } from "@/components/ThemedText";
import { Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Portal } from "@gorhom/portal";
import { User } from "@/context/user-context";

const { width } = Dimensions.get("window");

export interface EditProfileSheetRef {
    open: () => void;
    close: () => void;
}

const EditProfileSheet = forwardRef<EditProfileSheetRef, { user: User }>(({ user }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = ["25%", "50%", "75%"];
    const [, setIsBottomSheetOpen] = useState(false);

    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("Boston, MA");

    const locations = [
        "Boston, MA",
        "New York, NY",
        "San Francisco, CA",
        "Chicago, IL",
        "Los Angeles, CA",
        "Seattle, WA",
        "Austin, TX",
        "Miami, FL",
    ];

    const handleSelectLocation = (location: string) => {
        setSelectedLocation(location);
        setIsLocationDropdownOpen(false);
    };

    const handleOpenBottomSheet = useCallback(() => {
        bottomSheetRef.current?.expand();
        setIsBottomSheetOpen(true);
    }, []);

    const closeSheet = useCallback(() => {
        bottomSheetRef.current?.close();
        setIsBottomSheetOpen(false);
    }, []);

    const renderBackdrop = useCallback(
        (props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                pressBehavior="close"
                enableTouchThrough={false}
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            />
        ),
        [],
    );

    useImperativeHandle(ref, () => ({
        open: handleOpenBottomSheet,
        close: closeSheet,
    }));

    return (
        <Portal>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                handleIndicatorStyle={styles.bottomSheetIndicator}
                backgroundStyle={styles.bottomSheetBackground}
                backdropComponent={renderBackdrop}
                onClose={() => setIsBottomSheetOpen(false)}>
                <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContentContainer}>
                    <ThemedText
                        style={{
                            alignSelf: "flex-start",
                            fontFamily: "Outfit",
                            fontSize: 24,
                            fontWeight: 600,
                            paddingVertical: 4,
                        }}>
                        Edit Profile
                    </ThemedText>
                    <View style={styles.profileEditContainer}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: user?.profile_picture || "https://example.com/placeholder.jpg" }}
                                style={styles.profileImage}
                            />
                            <TouchableOpacity style={styles.editImageButton}>
                                <Ionicons name="pencil" size={16} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <ThemedText style={styles.inputLabel}>Name</ThemedText>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Your name"
                                defaultValue={user?.name || ""}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <ThemedText style={styles.inputLabel}>Username</ThemedText>
                            <TextInput style={styles.textInput} placeholder="username" defaultValue={user?.username} />
                        </View>

                        <View style={styles.inputContainer}>
                            <ThemedText style={styles.inputLabel}>Location</ThemedText>
                            <TouchableOpacity
                                style={styles.locationInput}
                                onPress={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}>
                                <ThemedText style={{ fontFamily: "Outfit" }}>{selectedLocation}</ThemedText>
                                <Ionicons
                                    name={isLocationDropdownOpen ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#333"
                                />
                            </TouchableOpacity>

                            {isLocationDropdownOpen && (
                                <View style={styles.dropdownContainer}>
                                    <BottomSheetScrollView
                                        style={styles.dropdownScroll}
                                        keyboardShouldPersistTaps="handled"
                                        showsVerticalScrollIndicator={false}>
                                        {locations.map((location, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[
                                                    styles.dropdownItem,
                                                    selectedLocation === location && styles.dropdownItemSelected,
                                                ]}
                                                onPress={() => handleSelectLocation(location)}>
                                                <ThemedText
                                                    style={[
                                                        styles.dropdownText,
                                                        selectedLocation === location && styles.dropdownTextSelected,
                                                    ]}>
                                                    {location}
                                                </ThemedText>
                                                {selectedLocation === location && (
                                                    <Ionicons name="checkmark" size={18} color="#F9CA24" />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </BottomSheetScrollView>
                                </View>
                            )}
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => closeSheet()}>
                                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton}>
                                <ThemedText style={styles.saveButtonText}>Save changes</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </Portal>
    );
});

const styles = StyleSheet.create({
    bottomSheetBackground: {
        backgroundColor: "#fff",
    },
    bottomSheetIndicator: {
        backgroundColor: "#DDDDDD",
        width: 40,
    },
    bottomSheetContentContainer: {
        padding: 20,
    },
    bottomSheetTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "Outfit",
        alignSelf: "center",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    menuIcon: {
        marginRight: 15,
        color: "#333",
    },
    menuText: {
        fontSize: 18,
        fontFamily: "Outfit",
    },
    hamburgerButton: {
        position: "absolute",
        top: 10,
        right: 20,
        zIndex: 10,
        borderRadius: 20,
        padding: 8,
        elevation: 5,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        backgroundColor: "transparent",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    reviewsContainer: {
        marginVertical: 24,
    },
    scrollContent: {
        paddingVertical: 8,
        gap: 8,
    },
    topOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 260,
        borderBottomLeftRadius: width / 2.5,
        borderBottomRightRadius: width / 2.5,
        zIndex: 0,
    },
    avatar: {
        width: 132,
        height: 132,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: "white",
        marginTop: 40,
        zIndex: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.5,
        // Android shadow
        elevation: 5,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 500,
        fontFamily: "Outfit",
        paddingTop: 4,
    },
    statLabel: {
        fontSize: 16,
        color: "#666",
        fontFamily: "Outfit",
    },
    retryButton: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#0066cc",
        borderRadius: 5,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    profileEditContainer: {
        padding: 10,
        alignItems: "center",
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 8,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editImageButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#F9CA24",
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        width: "100%",
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 8,
        fontFamily: "Outfit",
    },
    textInput: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: "Outfit",
    },
    locationInput: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "Outfit",
    },
    buttonContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "500",
        fontFamily: "Outfit",
    },
    saveButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F9CA24",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "500",
        fontFamily: "Outfit",
        color: "#000",
    },
    dropdownContainer: {
        position: "absolute",
        top: -180, // Position below the input field and label
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        zIndex: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdownScroll: {
        maxHeight: 200,
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    dropdownItemSelected: {
        backgroundColor: "rgba(249, 202, 36, 0.1)",
        fontFamily: "Outfit",
    },
    dropdownText: {
        fontSize: 16,
        fontFamily: "Outfit",
    },
    dropdownTextSelected: {
        fontWeight: "500",
        fontFamily: "Outfit",
    },
});

export default EditProfileSheet;
