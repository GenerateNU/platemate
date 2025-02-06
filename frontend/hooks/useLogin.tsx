import * as SecureStore from "expo-secure-store";

const baseUrl = "https://57a7-2601-19b-480-4dc0-f909-8c1c-d184-ab76.ngrok-free.app"; // will need to be changed to actual URl and store in .env

async function useLogin() {
    return { login: login, register: register };
}

async function login(email: string, password: string) {
    await loginRegister(email, password, "login");
}

async function register(email: string, password: string) {
    await loginRegister(email, password, "register");
}

// used to hit the login or register endpoint and store the asociated information for that user within their browser local storage
async function loginRegister(email: string, password: string, route: string) {
    let url = baseUrl + "/auth/" + route;

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

        const accessToken = await userReq.headers.get("Access_token");
        const refreshToken = await userReq.headers.get("Refresh_token");
        if (!accessToken) {
            throw Error("Access token not found in response");
        }
        if (!refreshToken) {
            throw Error("Refresh token not found in response");
        }

        await SecureStore.setItemAsync("accessToken", "Bearer " + accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
    } catch (err) {
        console.log("The error is " + err);
    }
}

export { useLogin, loginRegister };
