import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { getFollowingCheck } from "@/api/user";

export function useFollowingStatus(userToCheckId: string) {
    const { user } = useUser();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const checkFollowingStatus = async () => {
            if (!user || !userToCheckId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await getFollowingCheck(user.id, userToCheckId);
                setIsFollowing(response.isFollowing);
            } catch (err) {
                console.error("Error checking following status:", err);
                setError(err instanceof Error ? err : new Error("Unknown error"));
                // Default to not following on error
                setIsFollowing(false);
            } finally {
                setLoading(false);
            }
        };

        checkFollowingStatus();
    }, [user, userToCheckId]);

    return { isFollowing, loading, error };
}
