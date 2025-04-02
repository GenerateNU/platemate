"use client";

import type React from "react";
import { useEffect } from "react";
import useAuthStore from "@/auth/store";

// This component handles auth initialization and doesn't render anything visible
export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const { initializeAuth } = useAuthStore();

    useEffect(() => {
        // Initialize auth when the app starts
        console.log("Initializing authentication...");
        initializeAuth();
    }); // Empty dependency array ensures this runs only once

    return <>{children}</>;
};
