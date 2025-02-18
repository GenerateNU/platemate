import { useEffect, useState } from "react";
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
        let filtered = await recents;
        if ((await recents).includes(search)) {
            filtered = (await recents).filter((item) => item !== search);
        }
        let newRecents = [search, ...(await filtered)];
        newRecents = newRecents.slice(0, MAX_RECENTS);
        console.log(newRecents);
        asyncStorage.setItem(searchSet, JSON.stringify(newRecents));
        setRecents(newRecents);
    };

    const deleteRecent = async (term: string) => {
        if (searchSet.trim() === "" || term.trim() === "") {
            return;
        }
        let filtered = await recents;
        filtered = filtered.filter((item) => item !== term);
        asyncStorage.setItem(searchSet, JSON.stringify(filtered));
        console.log(filtered);
        setRecents(filtered);
    };

    const getRecents = () => {
        return recents;
    };

    return { getRecents, appendSearch, deleteRecent };
}
