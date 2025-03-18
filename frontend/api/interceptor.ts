import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

let isRefreshing = false;
let refreshQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

const processQueue = (error: unknown, token = null) => {
    refreshQueue.forEach((promise) => {
        if (token) {
            promise.resolve(token);
        } else {
            promise.reject(error);
        }
    });
    refreshQueue = [];
};

// Request Interceptor: Attach Token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check for Unauthorized error & non-retry request
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push({ resolve, reject });
                })
                    .then((newToken) => {
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;
            try {
                const refreshToken = await AsyncStorage.getItem("refreshToken");

                if (!refreshToken) throw new Error("No refresh token available");

                // Refresh token request
                const { data } = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/auth/refresh`, {
                    refreshToken,
                });

                const newAccessToken = data.accessToken;
                await AsyncStorage.setItem("accessToken", newAccessToken);

                processQueue(null, newAccessToken);
                isRefreshing = false;

                // Retry original request with new token
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;

                // Logout user if refresh token fails
                await AsyncStorage.removeItem("accessToken");
                await AsyncStorage.removeItem("refreshToken");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
