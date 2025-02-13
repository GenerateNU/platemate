import * as SecureStore from "expo-secure-store";

export async function revalidateAuth() {
    try {
        // check if the user has valid login/refresh, redirect user to login page if their auth is ass
        const url = "https://57a7-2601-19b-480-4dc0-f909-8c1c-d184-ab76.ngrok-free.app/protected/";
        var accessToken = await SecureStore.getItemAsync("accessToken");
        var refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!accessToken || !refreshToken) {
            // redirect user to login page
            throw Error("User does not have access or refresh token");
        }
        console.log(accessToken);
        console.log(refreshToken);

        const authReq = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: accessToken,
                refresh_token: refreshToken,
            },
        });

        if (!authReq.ok) {
            const { message } = await authReq.json();
            throw Error(message);
        }

        // if the user was able to authenticate correctly, retrieve new access and refresh token from response
        accessToken = await authReq.headers.get("access_token");
        refreshToken = await authReq.headers.get("refresh_token");
        if (accessToken && refreshToken) {
            // save the new values
            await SecureStore.setItemAsync("accessToken", accessToken);
            await SecureStore.setItemAsync("refreshToken", refreshToken);
        }
        return true;
    } catch (err) {
        console.log("Error: " + err);
        console.log("Redirecting user to login page...");
        return false;
    }
}
