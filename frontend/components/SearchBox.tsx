import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface SearchBoxProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

export function SearchBox({ value, onChangeText, ...rest }: SearchBoxProps) {
    return <TextInput value={value} onChangeText={onChangeText} {...rest} />;
}

// Example usage:

// import { SearchBox } from "@/components/SearchBox";

// <SearchBox
//   placeholder="Type to search..."
//   value={searchValue}
//   onChangeText={(text) => setSearchValue(text)}
//   // Can also pass in other TextInputProps: keyboardType, etc...
// />
