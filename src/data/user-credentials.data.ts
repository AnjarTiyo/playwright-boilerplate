export enum UserEnum {
    STANDARD_USER = "STANDARD_USER",
    LOCKED_OUT_USER = "LOCKED_OUT_USER",
    PROBLEM_USER = "PROBLEM_USER"
}

export type UserType = {
    username: string;
    password: string;
}

export const STANDARD_USER = {
    username: "standard_user",
    password: "secret_sauce"
};

export const LOCKED_OUT_USER = {
    username: "locked_out_user",
    password: "secret_sauce"
};

export const PROBLEM_USER = {
    username: "problem_user",
    password: "secret_sauce"
};