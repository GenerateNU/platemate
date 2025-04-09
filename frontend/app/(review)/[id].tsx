import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { ThemedView } from "@/components/themed/ThemedView";
import ReviewDetail from "@/components/review/ReviewDetail";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed/ThemedText";
import { StarRating } from "@/components/ui/StarReview";
import React, { useEffect } from "react";
import { TReview } from "@/types/review";
import { getReviewById } from "@/api/reviews";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { vote } from "@/api/review";
import { useUser } from "@/context/user-context";
import { SearchBox } from "@/components/SearchBox";
import { makeRequest } from "@/api/base";
import UserInfoRowTimed from "@/components/UserInfo/UserInfoRowTimed";

enum LikeState {
    LIKED = "LIKE",
    DISLIKED = "DISLIKE",
    NOT_LIKED = "NEUTRAL",
}

export default function Route() {
    const { id } = useLocalSearchParams<{
        id: string;
    }>();
    const [review, setReview] = React.useState<TReview | null>(null);
    const [likeState, setLikeState] = React.useState(LikeState.NOT_LIKED);
    const { user } = useUser();
    const [searchText, setSearchText] = React.useState("");

    const navigation = useNavigation();
    const handleSubmit = async () => {
        console.log("submit");
        if (!user) return;
        if (!review) return;
        let sendComment = await makeRequest(`/api/v1/review/${id}/comments`, "POST", {
            content: searchText,
            review: id,
            user: {
                _id: user.id,
                pfp: user.profile_picture,
                username: user.username,
            },
        });
        // @ts-ignore
        setReview({
            ...review,
            comments: [
                ...review.comments,
                {
                    content: searchText,
                    user: {
                        _id: user.id,
                        pfp: user.profile_picture,
                        username: user.username,
                    },
                    timestamp: new Date(),
                },
            ],
        });
        setSearchText("");
    };

    useEffect(() => {
        if (!user) return;
        getReviewById(id, user.id).then((res) => {
            setReview(res);
            if (res.like) {
                setLikeState(LikeState.LIKED);
            }
            if (res.dislike) {
                setLikeState(LikeState.DISLIKED);
            }
        });
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleUpvote = () => {
        if (!review || !user) return;
        vote(review._id, user.id, 1).then((res) => {
            console.log(res);
            setLikeState(res as LikeState);
        });
    };

    const handleDownvote = () => {
        if (!review || !user) return;
        vote(review._id, user.id, -1).then((res) => {
            console.log(res);
            setLikeState(res as LikeState);
        });
    };

    const insets = useSafeAreaInsets();
    if (!review) {
        // @TODO - handle loading and error state elegantly
        return (
            <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#ffcf0f" />
                <ThemedText style={{ marginTop: 10 }}>Loading review...</ThemedText>
            </ThemedView>
        );
    }
    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
            <ScrollView style={{ paddingBottom: 64 }}>
                <ThemedView style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color="black" />
                        </TouchableOpacity>
                        <ThemedText style={styles.headerTitle}>Review Detail</ThemedText>
                    </View>

                    {/* User Info */}
                    <View style={styles.userInfo}>
                        <View style={styles.userInfoLeft}>
                            <Image source={{ uri: review?.reviewer.pfp }} style={styles.profilePicture} />
                            <View>
                                <ThemedText style={styles.userName}>{review?.reviewer.username}</ThemedText>
                                <ThemedText style={styles.userHandle}>@{review?.reviewer.username}</ThemedText>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingBottom: 12 }}>
                        <TouchableOpacity
                            onPress={() => {
                                router.push(`/(menuItem)/${review?.menuItem}`);
                            }}>
                            <ThemedText type="title">{review?.menuItemName}</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                router.push(`/(restaurant)/${review?.restaurantId}`);
                            }}>
                            <ThemedText type="default">at {review?.restaurantName}</ThemedText>
                        </TouchableOpacity>
                    </View>
                    {/* Tags */}
                    <View style={styles.tagsContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.scrollableTags}>
                            {[].map((tag, index) => (
                                <ThemedText key={index} style={styles.tag}>
                                    {tag}
                                </ThemedText>
                            ))}
                        </ScrollView>
                    </View>
                    {/* Ratings Grid */}
                    <View style={styles.ratingsGridContainer}>
                        <View style={styles.ratingsGrid}>
                            <View style={styles.ratingColumn}>
                                <View style={styles.ratingBox}>
                                    <ThemedText style={styles.ratingTitle}>Overall</ThemedText>
                                    <StarRating
                                        avgRating={review.rating.overall}
                                        numRatings={-1}
                                        showAvgRating={false}
                                        showNumRatings={false}
                                    />
                                </View>
                                <View style={styles.ratingBox}>
                                    <ThemedText style={styles.ratingTitle}>Value</ThemedText>
                                    <StarRating
                                        avgRating={review.rating.value}
                                        numRatings={-1}
                                        showAvgRating={false}
                                        showNumRatings={false}
                                    />
                                </View>
                            </View>
                            <View style={[styles.ratingColumn, styles.ratingColumnRight]}>
                                <View style={styles.ratingBox}>
                                    <ThemedText style={styles.ratingTitle}>Taste</ThemedText>
                                    <StarRating
                                        avgRating={review.rating.taste}
                                        numRatings={-1}
                                        showAvgRating={false}
                                        showNumRatings={false}
                                    />
                                </View>
                                <View style={styles.ratingBox}>
                                    <ThemedText style={styles.ratingTitle}>Portion</ThemedText>
                                    <StarRating
                                        avgRating={review.rating.portion}
                                        numRatings={-1}
                                        showAvgRating={false}
                                        showNumRatings={false}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Content */}
                    <ThemedText type="defaultSemiBold">Thoughts</ThemedText>
                    <ThemedText style={styles.reviewContent}>{review?.content}</ThemedText>

                    {/* Images */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.imageScroll}
                        contentContainerStyle={styles.imageContainer}>
                        {[].map((image, index) => (
                            <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
                        ))}
                    </ScrollView>

                    {/* Action Bar */}
                    <View style={styles.actionBar}>
                        <View style={styles.voteContainer}>
                            <TouchableOpacity onPress={handleUpvote}>
                                <Entypo
                                    name="arrow-with-circle-up"
                                    size={32}
                                    color={likeState === LikeState.LIKED ? "#FFCF0F" : "black"}
                                />
                            </TouchableOpacity>
                            <ThemedText style={styles.voteCount}>{review?.likes}</ThemedText>
                            <TouchableOpacity onPress={handleDownvote}>
                                <Entypo
                                    name="arrow-with-circle-down"
                                    size={32}
                                    color={likeState === LikeState.DISLIKED ? "#FFCF0F" : "black"}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="chatbubble-outline" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Entypo name="dots-three-vertical" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Comments */}
                    <View style={{ marginTop: 16 }}>
                        <ThemedText type="defaultSemiBold">Comments</ThemedText>
                        {review?.comments.map((comment) => (
                            <View
                                key={comment._id}
                                style={{
                                    borderBottomColor: "#F5f5f5",
                                    borderBottomWidth: 1,
                                    paddingVertical: 16,
                                }}>
                                <TouchableOpacity onPress={() => router.push(`/friend/${comment.user._id}`)}>
                                    <UserInfoRowTimed
                                        name={comment.user.username}
                                        username={comment.user.username}
                                        icon={comment.user.pfp}
                                        time={new Date(new Date() - new Date(comment.timestamp)).getHours()}
                                    />
                                </TouchableOpacity>
                                <ThemedText
                                    style={{
                                        paddingVertical: 8,
                                    }}>
                                    {comment.content}
                                </ThemedText>
                            </View>
                        ))}
                    </View>
                </ThemedView>
            </ScrollView>
            <KeyboardAvoidingView
                behavior="padding"
                style={{
                    bottom: 32,
                    position: "absolute",
                    width: "100%",
                    backgroundColor: "#fff",
                    padding: 16,
                    marginBottom: 32,
                }}>
                <View style={{ marginBottom: 16 }}>
                    <SearchBox
                        icon={<Ionicons name="chatbubble-outline" size={24} color="black" />}
                        placeholder="What are your thoughts?"
                        recent={false}
                        name="general"
                        onSubmit={handleSubmit}
                        value={searchText}
                        onChangeText={setSearchText}
                        filter={false}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
    },
    content: {
        padding: 16,
        paddingBottom: 256,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "left",
        fontFamily: "Nunito",
    },
    errorText: {
        color: "red",
        marginBottom: 20,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    userInfoLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    restaurantInfo: {
        marginBottom: 20,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "Source Sans 3",
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFD700",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        fontSize: 20,
        fontWeight: "600",
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Nunito",
        lineHeight: 20,
    },
    userHandle: {
        fontSize: 14,
        color: "#666",
        fontFamily: "Nunito",
        lineHeight: 16,
    },
    ratingsGridContainer: {
        marginBottom: 12,
        marginTop: 8,
        width: "100%",
    },
    ratingsGrid: {
        flexDirection: "row",
        width: "100%",
        gap: 24,
    },
    ratingColumn: {
        flex: 1,
        gap: 16,
    },
    ratingColumnRight: {
        alignItems: "flex-start",
    },
    ratingBox: {
        gap: 8,
        width: "100%",
        marginBottom: 10,
    },
    ratingTitle: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Nunito",
    },
    tagsContainer: {
        marginBottom: 4,
    },
    reviewContent: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 0,
        fontFamily: "Nunito",
    },
    imageScroll: {
        marginBottom: 24,
    },
    imageContainer: {
        gap: 12,
    },
    reviewImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
    },
    actionBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 8,
    },
    voteContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    voteCount: {
        fontSize: 16,
        fontWeight: "500",
    },
    actionButtons: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButton: {
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    actionCount: {
        fontSize: 14,
    },
    scrollableTags: {
        flexDirection: "row",
    },
    ratingDescription: {
        fontFamily: "Nunito",
        fontSize: 14,
        lineHeight: 16,
    },
    tag: {
        backgroundColor: "#fc0",
        color: "#000",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 12,
        fontFamily: "Source Sans 3",
    },
});
