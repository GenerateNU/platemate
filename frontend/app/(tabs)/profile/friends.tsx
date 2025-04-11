"use client";

import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FollowerItem from "@/components/profile/followers/FollowerItem";
import { TFriend } from "@/types/follower";
import useAuthStore from "@/auth/store";
import { makeRequest } from "@/api/base";

export default function FriendsScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState("");
    const [friends, setFriends] = useState<TFriend[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const { userId } = useAuthStore();

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async (pageNum = 1, isRefresh = false) => {
        if (friends.length == 0) {
            setLoading(true);
        }

        try {
            const data = await makeRequest(`/api/v1/user/${userId}/following`, "GET");
            if (!data) {
                throw new Error(data.message || "Failed to retrieve the user's friends");
            }

            if (data && data.length > 0) {
                const formattedUsers = data.map((user) => ({
                    id: user.id,
                    name: `${user.name}`,
                    username: `@${user.username}`,
                    avatar: user.profile_picture,
                }));

                setFriends(formattedUsers);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = useCallback(() => {
        if (!refreshing) {
            setRefreshing(true);
            setHasMoreData(true);
            fetchFriends(1, true);
        }
    }, [refreshing]);

    const handleLoadMore = useCallback(() => {
        if (!isLoadingMore && hasMoreData && !loading && !refreshing) {
            fetchFriends(page);
        }
    }, [isLoadingMore, hasMoreData, loading, refreshing, page]);

    const filteredFollowers = friends.filter(
        (follower) =>
            follower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            follower.username.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const renderFollower = ({ item }: { item: TFriend }) => <FollowerItem follower={item} />;

    const renderFooter = () => {
        if (!isLoadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#FFCA28" />
                <Text style={styles.loadingMoreText}>Loading more friends...</Text>
            </View>
        );
    };

    const renderNoMoreData = () => {
        if (friends.length > 0 && !hasMoreData && !isLoadingMore) {
            return (
                <View style={styles.noMoreDataContainer}>
                    <Text style={styles.noMoreDataText}>No more friends to load.</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={{ height: insets.top + 64 }} />
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search friends"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="rgba(0, 0, 0, 0.38)"
                />
            </View>

            {loading && page === 1 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFCA28" />
                    <Text style={styles.loadingText}>Loading friends...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredFollowers}
                    renderItem={renderFollower}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No friends found.</Text>
                        </View>
                    }
                    ListHeaderComponent={
                        <View style={styles.headerContainer}>
                            <Text style={styles.followersCount}>
                                {friends.length} {friends.length === 1 ? "Friend" : "Friends"}
                            </Text>
                        </View>
                    }
                    ListFooterComponent={
                        <>
                            {renderFooter()}
                            {renderNoMoreData()}
                            <View style={{ height: insets.bottom + 20 }} />
                        </>
                    }
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.3}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    searchContainer: {
        padding: 16,
        backgroundColor: "#FFFFFF",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    searchInput: {
        backgroundColor: "#F5F5F5",
        borderRadius: 4,
        padding: 12,
        fontFamily: "Roboto",
        fontSize: 16,
        color: "rgba(0, 0, 0, 0.87)",
    },
    headerContainer: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 8,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    listContainer: {
        paddingBottom: 8,
    },
    followersCount: {
        fontSize: 16,
        fontWeight: "500",
        color: "rgba(0, 0, 0, 0.87)",
        fontFamily: "Roboto",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        backgroundColor: "#FFFFFF",
        marginTop: 8,
        borderRadius: 8,
        marginHorizontal: 16,
    },
    emptyText: {
        fontSize: 16,
        color: "rgba(0, 0, 0, 0.6)",
        fontFamily: "Roboto",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "rgba(0, 0, 0, 0.6)",
        fontFamily: "Roboto",
    },
    footerLoader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
        backgroundColor: "#FFFFFF",
        marginTop: 8,
        borderRadius: 8,
        marginHorizontal: 16,
    },
    loadingMoreText: {
        marginLeft: 12,
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.6)",
        fontFamily: "Roboto",
    },
    noMoreDataContainer: {
        alignItems: "center",
        paddingVertical: 16,
        backgroundColor: "#FFFFFF",
        marginTop: 8,
        borderRadius: 8,
        marginHorizontal: 16,
    },
    noMoreDataText: {
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.6)",
        fontFamily: "Roboto",
    },
});
