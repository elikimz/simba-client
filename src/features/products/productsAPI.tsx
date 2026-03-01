// src/products/productsAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** --------- Types --------- */
export interface SellerNestedSchema {
  id: number;
  name?: string;
  // add more fields if your backend returns them
}

export interface CategoryNestedSchema {
  id: number;
  name?: string;
  // add more fields if your backend returns them
}

export interface ProductCreateInput {
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  discount_percentage?: number | null; // default 0.0 on backend
  stock: number;
  image_url?: string | null;
  images?: string[] | null; // for multiple images, if supported by backend
  category_id?: number | null;
  max_price?: number | null
}

export interface ProductUpdateInput {
  name?: string | null;
  description?: string | null;
  price?: number | null;
  original_price?: number | null;
  discount_percentage?: number | null;
  stock?: number | null;
  image_url?: string | null;
  images?: string[] | null; // for multiple images, if supported by backend
  category_id?: number | null;
  max_price?: number | null
}

export interface ProductResponse {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  discount_percentage: number;
  stock: number;
  image_url?: string | null;

  seller: SellerNestedSchema;
  category?: CategoryNestedSchema | null;

  created_at: string; // datetime ISO string
  updated_at: string; // datetime ISO string
}

/** --------- API --------- */
export const productsAPI = createApi({
  reducerPath: "productsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Products", "Product"],
  endpoints: (builder) => ({
    /** GET /products/ */
    listProducts: builder.query<ProductResponse[], void>({
      query: () => ({
        url: "/products/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Products", id: "LIST" },
              ...result.map((p) => ({ type: "Product" as const, id: p.id })),
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    /** GET /products/{product_id} */
    getProduct: builder.query<ProductResponse, number>({
      query: (product_id) => ({
        url: `/products/${product_id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, product_id) => [{ type: "Product", id: product_id }],
    }),

    /** POST /products/ */
    createProduct: builder.mutation<ProductResponse, ProductCreateInput>({
      query: (body) => ({
        url: "/products/",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    /** PUT /products/{product_id} */
    updateProduct: builder.mutation<
      ProductResponse,
      { product_id: number; body: ProductUpdateInput }
    >({
      query: ({ product_id, body }) => ({
        url: `/products/${product_id}`,
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Products", id: "LIST" },
        { type: "Product", id: arg.product_id },
      ],
    }),

    /** DELETE /products/{product_id} */
    deleteProduct: builder.mutation<{ detail?: string } | void, number>({
      query: (product_id) => ({
        url: `/products/${product_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, product_id) => [
        { type: "Products", id: "LIST" },
        { type: "Product", id: product_id },
      ],
    }),
  }),
});

export const {
  useListProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsAPI;