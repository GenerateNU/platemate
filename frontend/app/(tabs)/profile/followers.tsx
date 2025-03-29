"use client";

import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FollowerItem from "@/components/profile/followers/FollowerItem";
import { TFollower } from "@/types/follower";

export default function FollowersScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState("");
    const [followers, setFollowers] = useState<TFollower[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);

    useEffect(() => {
        fetchRandomUsers();
    }, []);

    const fetchRandomUsers = async (pageNum = 1, isRefresh = false) => {
        if (pageNum === 1) {
            setLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const response = await fetch(`https://randomuser.me/api/?results=10&page=${pageNum}`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const formattedUsers = data.results.map((user) => ({
                    id: user.login.uuid,
                    name: `${user.name.first} ${user.name.last}`,
                    username: `@${user.login.username}`,
                    avatar: user.picture.medium,
                }));

                if (isRefresh) {
                    setFollowers(formattedUsers);
                    setPage(2);
                } else if (pageNum === 1) {
                    setFollowers(formattedUsers);
                    setPage(2);
                } else {
                    setFollowers((prevFollowers) => [...prevFollowers, ...formattedUsers]);
                    setPage(pageNum + 1);
                }

                setHasMoreData(pageNum < 15);
            } else {
                setHasMoreData(false);
            }
        } catch (error) {
            console.error("Error fetching random users:", error);
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
            fetchRandomUsers(1, true);
        }
    }, [refreshing]);

    const handleLoadMore = useCallback(() => {
        if (!isLoadingMore && hasMoreData && !loading && !refreshing) {
            fetchRandomUsers(page);
        }
    }, [isLoadingMore, hasMoreData, loading, refreshing, page]);

    const filteredFollowers = followers.filter(
        (follower) =>
            follower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            follower.username.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const renderFollower = ({ item }: { item: TFollower }) => <FollowerItem follower={item} />;

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
        if (followers.length > 0 && !hasMoreData && !isLoadingMore) {
            return (
                <View style={styles.noMoreDataContainer}>
                    <Text style={styles.noMoreDataText}>No more followers to load.</Text>
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
                    <Text style={styles.loadingText}>Loading followers...</Text>
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
                            <Text style={styles.emptyText}>No followers found.</Text>
                        </View>
                    }
                    ListHeaderComponent={
                        <Text style={styles.followersCount}>
                            {followers.length} {followers.length === 1 ? "Friend" : "Friends"}
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
