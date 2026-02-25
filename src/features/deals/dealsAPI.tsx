// src/features/deals/dealsAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** --------- Types (match your FastAPI schemas) --------- */
export interface DealItemInput {
  product_id: number;
  deal_price?: number | null;
  discount_percentage?: number | null;
  sort_order?: number | null;
}

export interface DealCreateInput {
  title: string;
  description?: string | null;
  starts_at?: string | null; // ISO string
  ends_at?: string | null;   // ISO string
  is_active?: boolean;
  items?: DealItemInput[];
}

export interface DealUpdateInput {
  title?: string | null;
  description?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean | null;
  items?: DealItemInput[] | null; // if provided, replaces items
}

export interface DealProductResponse {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url?: string | null;

  // deal overrides
  deal_price?: number | null;
  discount_percentage?: number | null;
  sort_order?: number | null;
}

export interface DealResponse {
  id: number;
  title: string;
  description?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active: boolean;
  created_at: string;

  products: DealProductResponse[];
}

/** --------- API --------- */
export const dealsAPI = createApi({
  reducerPath: "dealsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Deals", "Deal", "LatestDeal"],
  endpoints: (builder) => ({
    /** GET /deals/ */
    listDeals: builder.query<DealResponse[], void>({
      query: () => ({
        url: "/deals/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Deals", id: "LIST" },
              ...result.map((d) => ({ type: "Deal" as const, id: d.id })),
            ]
          : [{ type: "Deals", id: "LIST" }],
    }),

    /** POST /deals/ */
    createDeal: builder.mutation<DealResponse, DealCreateInput>({
      query: (body) => ({
        url: "/deals/",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "Deals", id: "LIST" }, { type: "LatestDeal", id: "ONE" }],
    }),

    /** GET /deals/latest */
    getLatestDeal: builder.query<DealResponse, void>({
      query: () => ({
        url: "/deals/latest",
        method: "GET",
      }),
      providesTags: [{ type: "LatestDeal", id: "ONE" }],
    }),

    /** GET /deals/{deal_id} */
    getDeal: builder.query<DealResponse, number>({
      query: (deal_id) => ({
        url: `/deals/${deal_id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, deal_id) => [{ type: "Deal", id: deal_id }],
    }),

    /** PUT /deals/{deal_id} */
    updateDeal: builder.mutation<DealResponse, { deal_id: number; body: DealUpdateInput }>({
      query: ({ deal_id, body }) => ({
        url: `/deals/${deal_id}`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Deals", id: "LIST" },
        { type: "Deal", id: arg.deal_id },
        { type: "LatestDeal", id: "ONE" },
      ],
    }),

    /** DELETE /deals/{deal_id} */
    deleteDeal: builder.mutation<{ detail?: string } | void, number>({
      query: (deal_id) => ({
        url: `/deals/${deal_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, deal_id) => [
        { type: "Deals", id: "LIST" },
        { type: "Deal", id: deal_id },
        { type: "LatestDeal", id: "ONE" },
      ],
    }),
  }),
});

export const {
  useListDealsQuery,
  useCreateDealMutation,
  useGetLatestDealQuery,
  useGetDealQuery,
  useUpdateDealMutation,
  useDeleteDealMutation,
} = dealsAPI;