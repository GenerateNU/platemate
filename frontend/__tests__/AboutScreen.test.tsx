import { render } from "@testing-library/react-native";

import AboutScreen from "@/app/feed";

describe("home screen", () => {
    test("text renders correctly", () => {
        const { getByText } = render(<AboutScreen />);
        getByText("This text serves as the body content of the example stack.");
    });
});
