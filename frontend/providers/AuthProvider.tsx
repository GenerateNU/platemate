import React, { createContext, PropsWithChildren, useContext, useState } from "react";

interface AuthProviderProps {
    email: string;
    userId: string;
    accessToken: string;
    refreshToken: string;
    updateEmail: (email: string) => void;
    updateUserId: (userId: string) => void;
    updateAccessToken: (accessToken: string) => void;
    updateRefreshToken: (refreshToken: string) => void;
}

const AuthContext = createContext<AuthProviderProps>({
    email: "",
    userId: "",
    accessToken: "",
    refreshToken: "",
    updateEmail: (email: string) => {},
    updateUserId: (userId: string) => {},
    updateAccessToken: (accessToken: string) => {},
    updateRefreshToken: (refreshToken: string) => {},
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");

    const updateEmail = (email: string) => {
        setEmail(email);
    };

    const updateUserId = (userId: string) => {
        setUserId(userId);
    };

    const updateAccessToken = (accessToken: string) => {
        setAccessToken(accessToken);
    };

    const updateRefreshToken = (refreshToken: string) => {
        setRefreshToken(refreshToken);
    };

    return (
        <AuthContext.Provider
            value={{
                email,
                userId,
                accessToken,
                refreshToken,
                updateEmail,
                updateUserId,
                updateAccessToken,
                updateRefreshToken,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
