import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMenuItemById } from "@/api/menu-items";
import { TMenuItem } from "@/types/menu-item";
import AllReviews from "@/components/review/AllReviews";

export default function Route() {
    const [menuItem, setMenuItem] = useState<TMenuItem | null>(null);
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    useEffect(() => {
        if (id) {
            getMenuItemById(id).then((data) => {
                setMenuItem(data);
            });
        }
    }, [id]);

    if (!menuItem) {
        return null;
    }

    return <AllReviews menuItem={menuItem} navigation={router} insets={insets} />;
}
