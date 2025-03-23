"use client";

import type React from "react";
import { useEffect } from "react";
import useAuthStore from "@/auth/store";

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const { initializeAuth } = useAuthStore();

    useEffect(() => {
        console.log("Initializing authentication...");
        initializeAuth();
    }, [initializeAuth]);

    return <>{children}</>;
};
