import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** --------- Types --------- */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer" | string;
}

export interface LoginInput {
  username: string; // backend uses OAuth2PasswordRequestForm field name "username" (can be email or phone)
  password: string;
  grant_type?: "password";
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

/** --------- API --------- */
export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      // add global headers if you want
      return headers;
    },
  }),
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    /** POST /auth/register (application/json) */
    register: builder.mutation<TokenResponse, RegisterInput>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User", "Auth"],
    }),

    /** POST /auth/login (application/x-www-form-urlencoded) */
    login: builder.mutation<TokenResponse, LoginInput>({
      query: (body) => {
        const formData = new URLSearchParams();
        formData.append("username", body.username);
        formData.append("password", body.password);

        // optional OAuth2 fields
        if (body.grant_type) formData.append("grant_type", body.grant_type);
        if (body.scope) formData.append("scope", body.scope);
        if (body.client_id) formData.append("client_id", body.client_id);
        if (body.client_secret) formData.append("client_secret", body.client_secret);

        return {
          url: "/auth/login",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
      invalidatesTags: ["Auth", "User"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authAPI;