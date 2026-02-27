// src/features/heroBanners/heroBannersAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** --------- Types (match your FastAPI schemas) --------- */
export interface HeroBannerImageCreateInput {
  url: string;
  sort_order?: number;
  is_primary?: boolean;
}

export interface HeroBannerImageResponse {
  id: number;
  banner_id: number;
  url: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string; // ISO datetime
}

export interface HeroBannerCreateInput {
  title: string;
  description?: string | null;
  cta_text?: string; // default "Shop Now"
  cta_href?: string | null; // default "/products"
  starts_at?: string | null; // ISO datetime or null
  ends_at?: string | null; // ISO datetime or null
  is_active?: boolean; // default true
  sort_order?: number; // default 0
  images: HeroBannerImageCreateInput[];
}

export interface HeroBannerUpdateInput {
  title?: string | null;
  description?: string | null;
  cta_text?: string | null;
  cta_href?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean | null;
  sort_order?: number | null;
}

export interface HeroBannerResponse {
  id: number;
  title: string;
  description?: string | null;
  cta_text: string;
  cta_href?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  images: HeroBannerImageResponse[];
}

/** --------- API --------- */
export const heroBannersAPI = createApi({
  reducerPath: "heroBannersAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["HeroBanners", "HeroBanner"],
  endpoints: (builder) => ({
    /** GET /hero-banners/  (public) */
    listActiveBanners: builder.query<HeroBannerResponse[], void>({
      query: () => ({
        url: "/hero-banners/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "HeroBanners", id: "ACTIVE" },
              ...result.map((b) => ({ type: "HeroBanner" as const, id: b.id })),
            ]
          : [{ type: "HeroBanners", id: "ACTIVE" }],
    }),

    /** GET /hero-banners/admin (admin) */
    adminListAllBanners: builder.query<HeroBannerResponse[], void>({
      query: () => ({
        url: "/hero-banners/admin",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "HeroBanners", id: "ADMIN_LIST" },
              ...result.map((b) => ({ type: "HeroBanner" as const, id: b.id })),
            ]
          : [{ type: "HeroBanners", id: "ADMIN_LIST" }],
    }),

    /** POST /hero-banners/admin (admin) */
    adminCreateBanner: builder.mutation<HeroBannerResponse, HeroBannerCreateInput>({
      query: (body) => ({
        url: "/hero-banners/admin",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "HeroBanners", id: "ADMIN_LIST" }, { type: "HeroBanners", id: "ACTIVE" }],
    }),

    /** PUT /hero-banners/admin/{banner_id} (admin) */
    adminUpdateBanner: builder.mutation<
      HeroBannerResponse,
      { banner_id: number; body: HeroBannerUpdateInput }
    >({
      query: ({ banner_id, body }) => ({
        url: `/hero-banners/admin/${banner_id}`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "HeroBanners", id: "ADMIN_LIST" },
        { type: "HeroBanners", id: "ACTIVE" },
        { type: "HeroBanner", id: arg.banner_id },
      ],
    }),

    /** DELETE /hero-banners/admin/{banner_id} (admin) */
    adminDeleteBanner: builder.mutation<{ ok: boolean } | void, number>({
      query: (banner_id) => ({
        url: `/hero-banners/admin/${banner_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, banner_id) => [
        { type: "HeroBanners", id: "ADMIN_LIST" },
        { type: "HeroBanners", id: "ACTIVE" },
        { type: "HeroBanner", id: banner_id },
      ],
    }),

    /** POST /hero-banners/admin/{banner_id}/images (admin)
     *  NOTE: your backend currently accepts query params: url, sort_order, is_primary
     *  Example: /hero-banners/admin/1/images?url=...&sort_order=0&is_primary=true
     */
    adminAddBannerImage: builder.mutation<
      HeroBannerResponse,
      { banner_id: number; url: string; sort_order?: number; is_primary?: boolean }
    >({
      query: ({ banner_id, url, sort_order = 0, is_primary = false }) => ({
        url: `/hero-banners/admin/${banner_id}/images`,
        method: "POST",
        params: { url, sort_order, is_primary },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "HeroBanners", id: "ADMIN_LIST" },
        { type: "HeroBanners", id: "ACTIVE" },
        { type: "HeroBanner", id: arg.banner_id },
      ],
    }),

    /** DELETE /hero-banners/admin/images/{image_id} (admin) */
    adminDeleteBannerImage: builder.mutation<{ ok: boolean } | void, number>({
      query: (image_id) => ({
        url: `/hero-banners/admin/images/${image_id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "HeroBanners", id: "ADMIN_LIST" }, { type: "HeroBanners", id: "ACTIVE" }],
    }),

    /** PUT /hero-banners/admin/images/{image_id}/primary (admin) */
    adminSetPrimaryImage: builder.mutation<
      { ok: boolean } | void,
      { image_id: number; banner_id?: number }
    >({
      query: ({ image_id }) => ({
        url: `/hero-banners/admin/images/${image_id}/primary`,
        method: "PUT",
      }),
      // if you know banner_id, we can invalidate that specific banner too
      invalidatesTags: (_res, _err, arg) => {
        const base = [
          { type: "HeroBanners" as const, id: "ADMIN_LIST" },
          { type: "HeroBanners" as const, id: "ACTIVE" },
        ];
        return arg.banner_id ? [...base, { type: "HeroBanner" as const, id: arg.banner_id }] : base;
      },
    }),
  }),
});

export const {
  useListActiveBannersQuery,
  useAdminListAllBannersQuery,
  useAdminCreateBannerMutation,
  useAdminUpdateBannerMutation,
  useAdminDeleteBannerMutation,
  useAdminAddBannerImageMutation,
  useAdminDeleteBannerImageMutation,
  useAdminSetPrimaryImageMutation,
} = heroBannersAPI;