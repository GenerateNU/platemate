import { useState, useEffect } from "react";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const useGetUserById = (userId?: string) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUserById = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${BASE_URL}/api/v1/user/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch user: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserById();
    }, [userId]);

    return { user, isLoading, error };
};
