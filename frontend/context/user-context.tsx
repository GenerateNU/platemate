import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";
import useAuthStore from "@/auth/store";

const API_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export interface User {
    id: string;
    email: string;
    name: string;
    profile_picture?: string;
    username: string;
    followersCount: number;
    followingCount: number;
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    fetchUserProfile: () => Promise<User | null>;
    updateUserProfile: (userData: Partial<User>) => Promise<User | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const createAuthenticatedAxios = (token: string) => {
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export function UserProvider({ children }: { children: ReactNode }) {
    const { accessToken, refreshAccessToken, userId, isAuthenticated, logout } = useAuthStore();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = async (): Promise<User | null> => {
        if (!accessToken) {
            setError("No access token available");
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const api = createAuthenticatedAxios(accessToken);
            const response = await api.get("/api/v1/user/" + userId);
            const userData = response.data;
            console.log(userData);

            setUser(userData);
            return userData;
        } catch (error) {
            console.error("Error fetching user profile:", error);

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                try {
                    await refreshAccessToken();

                    if (accessToken) {
                        return fetchUserProfile();
                    }
                } catch (e: any) {
                    setError("Session expired. Please log in again." + e);
                    await logout();
                }
            } else {
                setError("Failed to load user profile");
            }

            return null;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && !user && !isLoading) {
            fetchUserProfile().then(() => {});
        }

        if (!isAuthenticated && user) {
            setUser(null);
        }
    }, [isAuthenticated, accessToken, user, isLoading, fetchUserProfile]);

    const contextValue = {
        user,
        isLoading,
        error,
        fetchUserProfile,
    } as UserContextType;

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}
