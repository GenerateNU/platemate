import { makeRequest } from "@/api/base";
import { LoginRequestBody, RegisterRequestBody } from "@/types/auth";

export async function getUserById(userId: string) {
    return await makeRequest(`/api/v1/user/${userId}`, "GET");
}

export async function login(body: LoginRequestBody) {
    const response = await makeRequest(
        "/api/v1/auth/login",
        "POST",
        { email: body.email, password: body.password },
        "Failed to login",
    );
    if (!response) {
        throw new Error(response.message || "an unknown error occurred");
    }
    return response;
}

export async function register(body: RegisterRequestBody) {
    const response = await makeRequest(
        "/api/v1/auth/register",
        "POST",
        {
            firstName: body.firstName,
            surname: body.surname,
            email: body.email,
            password: body.password,
        },
        "failed to register user",
    );
    if (!response) {
        throw new Error(response.message || "an unknown error occurred");
    }
    return response;
}
