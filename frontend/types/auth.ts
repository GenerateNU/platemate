export type RegisterRequestBody = {
    firstName: string;
    surname: string;
    email: string;
    password: string;
};

export type LoginRequestBody = {
    email: string;
    password: string;
};
