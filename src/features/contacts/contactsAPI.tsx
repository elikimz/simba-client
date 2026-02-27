// src/features/contacts/contactsAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** --------- Types --------- */
export interface ContactCreateInput {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message: string;
}

export interface ContactResponse {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message: string;
  is_read: boolean;
  created_at: string; // ISO datetime
}

export interface ContactMarkReadInput {
  is_read: boolean;
}

/** --------- API --------- */
export const contactsAPI = createApi({
  reducerPath: "contactsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Contacts", "Contact"],
  endpoints: (builder) => ({
    /** ✅ POST /contacts/ (public) */
    createContact: builder.mutation<ContactResponse, ContactCreateInput>({
      query: (body) => ({
        url: "/contacts/",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "Contacts", id: "ADMIN_LIST" }],
    }),

    /** ✅ GET /contacts/admin (admin) */
    adminListContacts: builder.query<ContactResponse[], void>({
      query: () => ({
        url: "/contacts/admin",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Contacts", id: "ADMIN_LIST" },
              ...result.map((c) => ({ type: "Contact" as const, id: c.id })),
            ]
          : [{ type: "Contacts", id: "ADMIN_LIST" }],
    }),

    /** ✅ PUT /contacts/admin/{contact_id}/read (admin) */
    adminMarkRead: builder.mutation<
      ContactResponse,
      { contact_id: number; body: ContactMarkReadInput }
    >({
      query: ({ contact_id, body }) => ({
        url: `/contacts/admin/${contact_id}/read`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Contacts", id: "ADMIN_LIST" },
        { type: "Contact", id: arg.contact_id },
      ],
    }),

    /** ✅ DELETE /contacts/admin/{contact_id} (admin) */
    adminDeleteContact: builder.mutation<{ ok: boolean } | void, number>({
      query: (contact_id) => ({
        url: `/contacts/admin/${contact_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, contact_id) => [
        { type: "Contacts", id: "ADMIN_LIST" },
        { type: "Contact", id: contact_id },
      ],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useAdminListContactsQuery,
  useAdminMarkReadMutation,
  useAdminDeleteContactMutation,
} = contactsAPI;