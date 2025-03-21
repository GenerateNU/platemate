type SettingKey =
    | "vegetarian"
    | "vegan"
    | "nutFree"
    | "shellfishAllergy"
    | "glutenFree"
    | "dairyFree"
    | "kosher"
    | "halal"
    | "pescatarian"
    | "keto"
    | "diabetic"
    | "soyFree"
    | "cameraAccess"
    | "contactSync";

type ToggleSettingItem = {
    key: SettingKey;
    label: string;
};

type MenuSettingItem = {
    label: string;
    onPress: () => void;
    showChevron?: boolean;
};

export type TSettingsData = {
    dietary: ToggleSettingItem[];
    privacy: ToggleSettingItem[];
    account: MenuSettingItem[];
    additional: MenuSettingItem[];
};
