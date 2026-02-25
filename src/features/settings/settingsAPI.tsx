// src/features/settings/settingsAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** --------- Types (match your FastAPI schemas) --------- */
export interface ChangePasswordInput {
  old_password: string;
  new_password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  reset_token: string;
}

export interface ResetPasswordInput {
  email: string;  
  reset_token: string;
  code: string;
  new_password: string;
}

export interface GenericMessageResponse {
  message: string;
}

/** --------- API --------- */
export const settingsAPI = createApi({
  reducerPath: "settingsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    /** POST /settings/change-password */
    changePassword: builder.mutation<GenericMessageResponse, ChangePasswordInput>({
      query: (body) => ({
        url: "/settings/change-password",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "Settings", id: "SELF" }],
    }),

    /** POST /settings/forgot-password */
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordInput>({
      query: (body) => ({
        url: "/settings/forgot-password",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    }),

    /** POST /settings/reset-password */
    resetPassword: builder.mutation<GenericMessageResponse, ResetPasswordInput>({
      query: (body) => ({
        url: "/settings/reset-password",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "Settings", id: "SELF" }],
    }),
  }),
});

export const {
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = settingsAPI;