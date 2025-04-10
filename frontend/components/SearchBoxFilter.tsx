import React, { useRef} from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SearchBoxProps } from "./SearchBox";
import { SortIcon } from "./icons/Icons";

export function SearchBoxFilter({ value, onChangeText, onSubmit, icon, recent, name, ...rest }: SearchBoxProps) {
    const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
    const inputRef = useRef<TextInput>(null);
    const [recentItems, setRecentItems] = useState<string[]>([]);

    const fetchRecents = useCallback(async () => {
        const recents = await getRecents();
        setRecentItems(recents);
    }, [getRecents]);

    async function clearRecents() {
        setRecentItems([]);
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current?.measureInWindow((height) => {
                setInputHeight(height + Dimensions.get("window").height * 0.01);
            });
        }
    }, [inputRef]);

    useEffect(() => {
        fetchRecents();
    }, [recent, fetchRecents]);

    const onSubmitEditing = () => {
        if (recent)
            appendSearch(value).then(() => {
                fetchRecents();
            });
        onSubmit();
    };

    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchBoxContainer}>
                <View>
                    <View style={styles.container}>
                        <TextInput
                            id={"search-input"}
                            ref={inputRef}
                            onSubmitEditing={handleSubmit}
                            value={value}
                            onChangeText={onChangeText}
                            {...rest}
                            style={{ ...styles.input, color: textColor }}
                        />
                        {icon && icon}
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => {}}>
                <SortIcon width={20} height={30} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontFamily: "Source Sans 3",
    },
    input: {
        flex: 1,
        fontFamily: "Source Sans 3",
    },
    icon: {
        marginLeft: 8,
        resizeMode: "contain",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
    },
    searchBoxContainer: {
        flex: 1,
        marginRight: 10,
    },
});
