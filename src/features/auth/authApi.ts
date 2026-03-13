import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    UserProfile
} from "./types";
import url from "../../url";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${url}/api/`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("access");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (data) => ({
                url: "auth/login/",
                method: "POST",
                body: data,
            }),
        }),
        register: builder.mutation<void, RegisterRequest>({
            query: (data) => ({
                url: "auth/register/",
                method: "POST",
                body: data,
            }),
        }),
        getProfile: builder.query<UserProfile, void>({
            query: () => "auth/me/",
        }),
        updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
            query: (data) => ({
                url: "auth/update_profile/",
                method: "PATCH",
                body: data,
            }),
        }),
        requestPasswordReset: builder.mutation<any, { email: string }>({
            query: (data) => ({
                url: "auth/request_password_reset/",
                method: "POST",
                body: data,
            }),
        }),
        verifyOtp: builder.mutation<any, { email: string; otp: string }>({
            query: (data) => ({
                url: "password-reset/verify/",
                method: "POST",
                body: data,
            }),
        }),
        confirmPasswordReset: builder.mutation<
            any,
            { email: string; otp: string; new_password:string }
        >({
            query: (data) => ({
                url: "auth/confirm_password_reset/",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useRequestPasswordResetMutation,
    useVerifyOtpMutation,
    useConfirmPasswordResetMutation
} = authApi;