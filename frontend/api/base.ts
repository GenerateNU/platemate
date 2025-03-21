import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function makeRequest(endpoint: string, method: RequestMethod, body?: any, message?: string): Promise<any> {
    const url = BASE_URL + endpoint;

    console.log(url);

    const config: AxiosRequestConfig = {
        method: method,
        data: body,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };

    const response: AxiosResponse = await axios(url, config);

    if (response.status !== 200) {
        throw new Error(response.statusText);
    }

    return await response.data;
}
