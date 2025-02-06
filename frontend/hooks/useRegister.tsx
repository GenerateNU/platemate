import { loginRegister } from "./useLogin";

export async function useRegister(user: string, password: string) {
    await loginRegister(user, password, "register");
}
