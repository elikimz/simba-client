// src/features/addresses/addressesAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** --------- Types (match your FastAPI schemas) --------- */
export interface AddressCreateInput {
  full_name: string;
  phone: string;
  county: string;
  town: string;
  street: string;
}

export interface AddressUpdateInput {
  full_name?: string | null;
  phone?: string | null;
  county?: string | null;
  town?: string | null;
  street?: string | null;
}

export interface AddressResponse {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  county: string;
  town: string;
  street: string;
  created_at: string; // datetime ISO string
}

/** --------- API --------- */
export const addressesAPI = createApi({
  reducerPath: "addressesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Addresses", "Address"],
  endpoints: (builder) => ({
    /** GET /addresses/ */
    listMyAddresses: builder.query<AddressResponse[], void>({
      query: () => ({
        url: "/addresses/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Addresses", id: "LIST" },
              ...result.map((a) => ({ type: "Address" as const, id: a.id })),
            ]
          : [{ type: "Addresses", id: "LIST" }],
    }),

    /** POST /addresses/ */
    createAddress: builder.mutation<AddressResponse, AddressCreateInput>({
      query: (body) => ({
        url: "/addresses/",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "Addresses", id: "LIST" }],
    }),

    /** PUT /addresses/{address_id} */
    updateAddress: builder.mutation<
      AddressResponse,
      { address_id: number; body: AddressUpdateInput }
    >({
      query: ({ address_id, body }) => ({
        url: `/addresses/${address_id}`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Addresses", id: "LIST" },
        { type: "Address", id: arg.address_id },
      ],
    }),

    /** DELETE /addresses/{address_id} */
    deleteAddress: builder.mutation<{ detail?: string } | void, number>({
      query: (address_id) => ({
        url: `/addresses/${address_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, address_id) => [
        { type: "Addresses", id: "LIST" },
        { type: "Address", id: address_id },
      ],
    }),
  }),
});

export const {
  useListMyAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressesAPI;