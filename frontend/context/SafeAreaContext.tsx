// @/context/SafeAreaContext.js
import React, { createContext, useContext, useState } from "react";
import { SafeAreaView, View } from "react-native";

// Create context with default values
const SafeAreaContext = createContext({
    topSafeAreaEnabled: true,
    setTopSafeAreaEnabled: (val: boolean) => {},
});

// Provider component
export const SafeAreaProvider = ({ children }) => {
    const [topSafeAreaEnabled, setTopSafeAreaEnabled] = useState(true);

    return (
        <SafeAreaContext.Provider value={{ topSafeAreaEnabled, setTopSafeAreaEnabled }}>
            {topSafeAreaEnabled ? (
                <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
            ) : (
                <View style={{ flex: 1 }}>{children}</View>
            )}
        </SafeAreaContext.Provider>
    );
};

// Hook for consuming the context
export const useSafeArea = () => useContext(SafeAreaContext);
