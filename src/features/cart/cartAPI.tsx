// src/features/cart/cartAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** --------- Types (match your backend schemas) --------- */
export interface CartItemCreateInput {
  product_id: number;
  quantity?: number; // backend default=1
}

export interface CartItemUpdateInput {
  quantity: number; // ge=1
}

export interface CartItemResponse {
  id: number;
  product_id: number;
  quantity: number;

  // optional product info
  product_name?: string | null;
  product_price?: number | null;
  product_image_url?: string | null;
}

export interface CartResponse {
  id: number;
  user_id: number;
  items: CartItemResponse[];
}

/** --------- API --------- */
export const cartAPI = createApi({
  reducerPath: "cartAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    /** GET /cart/ -> Get My Cart */
    getMyCart: builder.query<CartResponse, void>({
      query: () => ({
        url: "/cart/",
        method: "GET",
      }),
      providesTags: [{ type: "Cart", id: "MY_CART" }],
    }),

    /** POST /cart/items -> Add To Cart */
    addToCart: builder.mutation<CartResponse, CartItemCreateInput>({
      query: (body) => ({
        url: "/cart/items",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "Cart", id: "MY_CART" }],
    }),

    /** PUT /cart/items/{item_id} -> Update Cart Item */
    updateCartItem: builder.mutation<
      CartResponse,
      { item_id: number; body: CartItemUpdateInput }
    >({
      query: ({ item_id, body }) => ({
        url: `/cart/items/${item_id}`,
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "Cart", id: "MY_CART" }],
    }),

    /** DELETE /cart/items/{item_id} -> Remove Cart Item */
    removeCartItem: builder.mutation<CartResponse, number>({
      query: (item_id) => ({
        url: `/cart/items/${item_id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Cart", id: "MY_CART" }],
    }),
  }),
});

export const {
  useGetMyCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartAPI;