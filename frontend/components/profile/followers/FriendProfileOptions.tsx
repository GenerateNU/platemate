import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { StyleSheet, View } from "react-native";
import { Portal } from "@gorhom/portal";
import { User } from "@/context/user-context";
import { Button } from "@/components/Button";

export interface FriendProfileOptionsRef {
    open: () => void;
    close: () => void;
}

const EditFriendSheet = forwardRef<FriendProfileOptionsRef, { user: User }>(({ user }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = ["25%", "50%", "75%"];
    const [, setIsBottomSheetOpen] = useState(false);

    // const handleBlockUser = onPress(() => {
    // });

    // const handleReportUser = onPress(() => {
    // });

    // const handleRemoveFollower = onPress(() => {

    // });

    const closeSheet = useCallback(() => {
        bottomSheetRef.current?.close();
        setIsBottomSheetOpen(false);
    }, []);

    const handleOpenBottomSheet = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(1);
        setIsBottomSheetOpen(true);
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
                    <View style={styles.profileOptionsContainer}>
                        <Button
                            title="Block user"
                            containerStyle={styles.profileOptionsButtonContainer}
                            textStyle={[styles.profileOptionsText, { color: "#FF4747" }]}
                        />
                        <Button
                            title="Report user"
                            containerStyle={styles.profileOptionsButtonContainer}
                            textStyle={[styles.profileOptionsText, { color: "#FF4747" }]}
                        />
                        <Button
                            title="Remove follower"
                            containerStyle={styles.profileOptionsButtonContainer}
                            textStyle={[styles.profileOptionsText, { color: "#000" }]}
                        />
                        <View style={styles.cancelContainer}>
                            <Button
                                title="Cancel"
                                containerStyle={styles.profileOptionsButtonContainer}
                                textStyle={[styles.profileOptionsText, { color: "#000" }]}
                                onPress={closeSheet}
                            />
                        </View>
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </Portal>
    );
});

EditFriendSheet.displayName = "EditFriendSheet";

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
    profileOptionsContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
    },
    profileOptionsButtonContainer: {
        display: "flex",
        width: 333,
        height: 34,
        flexDirection: "column",
        justifyContent: "center",
        flexShrink: 0,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 20,
    },
    profileOptionsText: {
        textAlign: "center",
        fontFamily: "Source Sans 3",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: 18,
    },
    cancelContainer: {
        marginTop: 12,
    },
});

export default EditFriendSheet;
