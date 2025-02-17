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
                console.log("found recent searches");
                console.log(recents);
                return JSON.parse(recents);
            } else {
                console.log("didn't find search set");
                return [];
            }
        });
    }, [searchSet]);

    const appendSearch = async (search: string) => {
        if (searchSet.trim() === "" || search.trim() === "") {
            return;
        }
        if ((await recents).includes(search)) {
            recents.splice(recents.indexOf(search), 1);
        }
        let newRecents = [search, ...(await recents)];
        newRecents = newRecents.slice(0, MAX_RECENTS);
        console.log(newRecents);
        asyncStorage.setItem(searchSet, JSON.stringify(newRecents));
        setRecents(newRecents);
    };

    const getRecents = () => {
        return recents;
    };

    return { getRecents, appendSearch };
}
