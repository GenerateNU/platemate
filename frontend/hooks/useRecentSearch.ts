import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import asyncStorage from "@react-native-async-storage/async-storage";

export function useRecentSearch(searchSet: string = "") {
    // two functions, append recent and get recents
    const [recents, setRecents] = useState<string[]>([]);
    const MAX_RECENTS = 6;
    useEffect(() => {
        if (searchSet === "") {
            setRecents(() => []);
        }
        // @ts-ignore
        setRecents(async () => {
            const recents = await asyncStorage.getItem(searchSet);
            if (recents) {
                return JSON.parse(recents);
            } else {
                return [];
            }
        });
    }, [searchSet]);

    const appendSearch = (search: string) => {
        if (searchSet === "") {
            return;
        }
        setRecents((prev) => {
            let newRecents = [...prev, search];
            newRecents = prev.slice(0, MAX_RECENTS - 1);
            asyncStorage.setItem(searchSet, JSON.stringify(newRecents));
            return newRecents;
        });
    };

    const getRecents = () => {
        return recents;
    };

    return { getRecents, appendSearch };
}
