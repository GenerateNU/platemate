import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1`;

interface User {
    ID: string;
    Email: string;
    Username: string;
    Name: string;
    Reviews: string[];
    Count: number;
    Following: string[];
    Followers: string[];
    FollowingCount: number;
    FollowersCount: number;
    ProfilePicture: string;
}

export default function UserSearchScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users when search query changes
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(
                (user) =>
                    user.Username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (user.Name && user.Name.toLowerCase().includes(searchQuery.toLowerCase())),
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/user`);

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            // Assuming the response structure has a data field containing the users array
            const userList = data.data || data;
            setUsers(userList);
            setFilteredUsers(userList);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserPress = (user: User) => {
        // Navigate to user profile screen
        router.push(`/friend/${user.ID}`);
    };

    const renderUserItem = ({ item, index }: { item: User; index: number }) => (
        <TouchableOpacity
            style={[
                styles.userItem,
                { backgroundColor: index % 2 === 0 ? "rgba(249, 202, 36, 0.05)" : "rgba(255, 255, 255, 0.8)" },
            ]}
            onPress={() => handleUserPress(item)}>
            <View style={styles.userAvatarContainer}>
                {item.ProfilePicture ? (
                    <Image source={{ uri: item.ProfilePicture }} style={styles.userAvatar} />
                ) : (
                    <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
                        <ThemedText style={styles.avatarPlaceholderText}>
                            {(item.Name || item.Username).charAt(0).toUpperCase()}
                        </ThemedText>
                    </View>
                )}
            </View>

            <View style={styles.userInfo}>
                <View style={styles.nameContainer}>
                    <ThemedText style={styles.userName}>{item.Name || item.Username}</ThemedText>
                    <ThemedText style={styles.userUsername}> @{item.Username || item.Name}</ThemedText>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <ThemedText style={styles.statNumber}>{item.Reviews?.length || 0}</ThemedText>
                        <ThemedText style={styles.statLabel}>Reviews</ThemedText>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <ThemedText style={styles.statNumber}>{item.Following?.length || 0}</ThemedText>
                        <ThemedText style={styles.statLabel}>Friends</ThemedText>
                    </View>
                </View>
            </View>

            <View style={styles.chevronContainer}>
                <LinearGradient
                    colors={["#F9CA24", "#F1C40F"]}
                    style={styles.chevronBackground}
                    start={[0, 0]}
                    end={[1, 1]}>
                    <Ionicons name="chevron-forward" size={16} color="#000" />
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            {searchQuery.length > 0 ? (
                <>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="search-outline" size={50} color="#F9CA24" />
                    </View>
                    <ThemedText style={styles.emptyTextTitle}>No users found</ThemedText>
                    <ThemedText style={styles.emptyText}>We couldn't find anyone matching "{searchQuery}"</ThemedText>
                </>
            ) : (
                <>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="people-outline" size={50} color="#F9CA24" />
                    </View>
                    <ThemedText style={styles.emptyTextTitle}>No users available</ThemedText>
                    <ThemedText style={styles.emptyText}>Please check back later or refresh the list</ThemedText>
                </>
            )}
        </View>
    );

    return (
        <ThemedView
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                },
            ]}>
            <LinearGradient colors={["#F9CA24", "#F1C40F"]} style={[styles.header, { paddingTop: 24 }]}>
                <ThemedText style={styles.headerTitle}>Find Users</ThemedText>
            </LinearGradient>

            <View style={styles.searchWrapper}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by username or name"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#F9CA24" />
                    <ThemedText style={styles.loadingText}>Loading users...</ThemedText>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <View style={styles.errorIconContainer}>
                        <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
                    </View>
                    <ThemedText style={styles.errorTextTitle}>Oops!</ThemedText>
                    <ThemedText style={styles.errorText}>{error}</ThemedText>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
                        <LinearGradient
                            colors={["#F9CA24", "#F1C40F"]}
                            style={styles.retryButtonGradient}
                            start={[0, 0]}
                            end={[1, 1]}>
                            <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    renderItem={renderUserItem}
                    keyExtractor={(item) => item.ID}
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 40 }]}
                    ListEmptyComponent={renderEmptyList}
                    showsVerticalScrollIndicator={false}
                    refreshing={isLoading}
                    onRefresh={fetchUsers}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        padding: 16,
        paddingBottom: 24,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        fontFamily: "Nunito",
        color: "#000000",
        textAlign: "center",
        lineHeight: 40,
    },
    searchWrapper: {
        paddingHorizontal: 16,
        marginTop: -20,
        zIndex: 20,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        fontFamily: "Nunito",
        color: "#333333",
    },
    clearButton: {
        padding: 4,
    },
    listContent: {
        padding: 16,
        paddingTop: 24,
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    userAvatarContainer: {
        marginRight: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    userAvatarPlaceholder: {
        backgroundColor: "#F9CA24",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarPlaceholderText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    userInfo: {
        flex: 1,
        marginRight: 8,
    },
    nameContainer: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    userName: {
        fontSize: 17,
        fontWeight: "700",
        fontFamily: "Nunito",
        color: "#333333",
        letterSpacing: -0.3,
    },
    userUsername: {
        fontSize: 14,
        color: "#F9CA24",
        fontFamily: "Nunito",
    },
    statsContainer: {
        flexDirection: "row",
        marginTop: 8,
        alignItems: "center",
        backgroundColor: "rgba(249, 202, 36, 0.1)",
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 0,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    statNumber: {
        fontSize: 14,
        fontWeight: "700",
        fontFamily: "Nunito",
        color: "#333333",
        marginRight: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#777777",
        fontFamily: "Nunito",
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        marginHorizontal: 0,
    },
    chevronContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 4,
    },
    chevronBackground: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666666",
        fontFamily: "Inter",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    errorIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(255, 107, 107, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    errorTextTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        textAlign: "center",
        color: "#666666",
        fontFamily: "Inter",
        marginBottom: 24,
    },
    retryButton: {
        borderRadius: 25,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    retryButtonGradient: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
        fontFamily: "Nunito",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "rgba(249, 202, 36, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    emptyTextTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        textAlign: "center",
        color: "#666666",
        fontFamily: "Nunito",
    },
    separator: {
        height: 8,
    },
});
