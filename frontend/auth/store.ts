import { create, StoreApi, UseBoundStore } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface User {
    userId: string;
    email: string;
    name: string;
    profilePictureURL?: string;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    email: string | undefined;
    initializeAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    refreshAccessToken: () => Promise<void>;
    logout: () => Promise<void>;
}

const useAuthStore: UseBoundStore<StoreApi<AuthState>> = create<AuthState>((set, get) => ({
    accessToken: null,
    refreshToken: null,
    userId: null,
    isAuthenticated: false,
    loading: true,
    email: undefined,

    initializeAuth: async () => {
        try {
            const storedAccessToken = await AsyncStorage.getItem("accessToken");
            const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
            const storedUserId = await AsyncStorage.getItem("userId");
            const storedEmail = (await AsyncStorage.getItem("email")) || undefined;

            if (storedAccessToken && storedRefreshToken) {
                set({
                    accessToken: storedAccessToken,
                    refreshToken: storedRefreshToken,
                    userId: storedUserId,
                    isAuthenticated: true,
                    email: storedEmail,
                });

                // Optionally refresh token if needed
                await get().refreshAccessToken();
            }
        } catch (error) {
            console.error("Error initializing auth:", error);
        } finally {
            set({ loading: false });
        }
    },

    // Login function
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
                email,
                password,
            });

            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;
            const userId = response.data.user;
            const userEmail = email;

            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("refreshToken", refreshToken);
            await AsyncStorage.setItem("userId", userId);
            await AsyncStorage.setItem("email", userEmail); // storing email so that on the user setting page the email can be displayed once the user logs in, is this okay???

            set({
                accessToken,
                refreshToken,
                userId: userId,
                isAuthenticated: true,
                email: userEmail,
            });

            console.log("Stored Email:", await AsyncStorage.getItem("email"));
            return response.data;
        } catch (error: any) {
            console.error("Login error:", error.response?.data || error.message);
            throw error;
        }
    },

    // Register function
    register: async (email, password, name) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/register`, {
                email,
                password,
                name,
            });

            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;
            const userId = response.data.user;
            const userEmail = response.data.userEmail;

            if (accessToken && refreshToken) {
                await AsyncStorage.setItem("accessToken", accessToken);
                await AsyncStorage.setItem("refreshToken", refreshToken);
                await AsyncStorage.setItem("userId", userId);
                await AsyncStorage.setItem("email", userEmail);

                set({
                    accessToken,
                    refreshToken,
                    userId: userId,
                    isAuthenticated: true,
                    email: userEmail,
                });
            }

            return response.data;
        } catch (error: any) {
            console.error("Registration error:", error.response?.data || error.message);
            throw error;
        }
    },

    // Refresh access token
    refreshAccessToken: async () => {
        const { refreshToken, email } = get(); // This is valid - get() returns the current state

        if (!refreshToken) {
            console.warn("No refresh token available, user needs to log in again.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
                refresh_token: refreshToken,
            });
            const newAccessToken = response.data.access_token;
            const newRefreshToken = response.data.refresh_token;
            const newUserId = response.data.user;

            await AsyncStorage.setItem("accessToken", newAccessToken);
            await AsyncStorage.setItem("userId", newUserId);
            if (newRefreshToken) {
                await AsyncStorage.setItem("refreshToken", newRefreshToken);
                set({ refreshToken: newRefreshToken });
            }

            set({ accessToken: newAccessToken, userId: newUserId, email});
            return response.data;
        } catch (error) {
            console.error("Error refreshing token:", error);
            // Call logout if refresh token is invalid
            await get().logout();
            throw error;
        }
    },

    // Logout function
    logout: async () => {
        try {
            // Clear tokens from storage
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");
            await AsyncStorage.removeItem("userId");
            await AsyncStorage.removeItem("email");

            // Reset state
            set({
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                userId: null,
                email: undefined,
            });
        } catch (error) {
            console.error("Logout error:", error);
        }
    },
}));

export default useAuthStore;
