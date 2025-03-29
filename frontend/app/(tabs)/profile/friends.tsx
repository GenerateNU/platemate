"use client";

import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FollowerItem from "@/components/profile/followers/FollowerItem";
import { TFriend } from "@/types/follower";
import useAuthStore from "@/auth/store";

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
            const response = await fetch(`https://externally-exotic-orca.ngrok-free.app/api/v1/user/${userId}/following`);
            const data = await response.json();

            if (data && data.length > 0) {
                const formattedUsers = data.map((user) => ({
                    id: user.id,
                    name: `${user.name}`,
                    username: `@${user.username}`,
                    avatar: user.profile_picture,
                }));

                setFriends(formattedUsers);

                // dont think this stuff is needed anymore but left it in case 
                // if (isRefresh) {
                //     setFollowers(formattedUsers);
                //     setPage(2);
                // } else if (pageNum === 1) {
                //     setFollowers(formattedUsers);
                //     setPage(2);
                // } else {
                //     setFollowers((prevFollowers) => [...prevFollowers, ...formattedUsers]);
                //     setPage(pageNum + 1);
                // }

                // setHasMoreData(pageNum < 15);
            } else {
                // setHasMoreData(false);
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
                <ActivityIndicator size="small" color="#F7B418" />
                <Text style={styles.loadingMoreText}>Loading more followers...</Text>
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
        <View style={[styles.container, { paddingTop: 32 }]}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search friends"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#727272"
                />
            </View>

            {loading && page === 1 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#F7B418" />
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
                        <Text style={styles.followersCount}>
                            {friends.length} {friends.length === 1 ? "Friend" : "Friends"}
                        </Text>
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
        backgroundColor: "#fff",
    },
    searchContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    searchInput: {
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        padding: 12,
        fontFamily: "Inter",
        fontSize: 16,
    },
    listContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 3,
        alignSelf: "stretch",
        width: "100%",
    },
    followersCount: {
        fontSize: 16,
        fontWeight: 700,
        marginBottom: 16,
        color: "#151619",
        fontFamily: "Inter",
        lineHeight: 20,
        letterSpacing: -0.165,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#727272",
        fontFamily: "Outfit",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#727272",
        fontFamily: "Outfit",
    },
    footerLoader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
    },
    loadingMoreText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#727272",
        fontFamily: "Outfit",
    },
    noMoreDataContainer: {
        alignItems: "center",
        paddingVertical: 16,
    },
    noMoreDataText: {
        fontSize: 14,
        color: "#727272",
        fontFamily: "Outfit",
    },
});
