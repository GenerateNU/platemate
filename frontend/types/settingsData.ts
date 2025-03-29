type SettingKey =
    | "accountEmail"
    | "accountPassword"
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
    | "porkFree"
    | "beefFree"
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
    credentials: ToggleSettingItem[];
    dietary: ToggleSettingItem[];
    privacy: ToggleSettingItem[];
    account: MenuSettingItem[];
    additional: MenuSettingItem[];
};
