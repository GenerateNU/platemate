import * as SecureStore from "expo-secure-store";

const baseUrl = "https://57a7-2601-19b-480-4dc0-f909-8c1c-d184-ab76.ngrok-free.app"; // will need to be changed to actual URl and store in .env

async function useLogin(email: string, password: string) {
    await loginRegister(email, password, "login");
}

// used to hit the login or register endpoint and store the asociated information for that user within their browser local storage
async function loginRegister(email: string, password: string, route: string) {
    let url = baseUrl + "/auth/" + route;
    console.log(url);

    try {
        const userReq = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (!userReq.ok) {
            throw Error("Unable to complete operation: " + route + " status code: " + userReq.statusText);
        }
        console.log(userReq.json());

        const accessToken = await userReq.headers.get("Access_token");
        const refreshToken = await userReq.headers.get("Refresh_token");
        if (!accessToken) {
            throw Error("Access token not found in response");
        }
        if (!refreshToken) {
            throw Error("Refresh token not found in response");
        }

        // note other devs may need to setup expo unless im dumb and didn't do it... : npm install -g expo-cli

        await SecureStore.setItemAsync("accessToken", "Bearer " + accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
    } catch (err) {
        console.log("The error is " + err);
    }
}

export { useLogin, loginRegister };
