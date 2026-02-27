


// src/features/orders/ordersAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** --------- Types --------- */
export interface OrderItemResponse {
  id: number;
  product_id: number;
  product_name?: string | null;

  // keep optional in case backend returns them later
  product_price?: number | null;
  product_image_url?: string | null;

  // ✅ your backend uses price_at_purchase
  price_at_purchase?: number | null;

  quantity: number;

  // optional helper if backend computes it
  line_total?: number | null;
}

/** ✅ Address returned on admin endpoint (and can be present elsewhere too) */
export interface AddressResponse {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  county: string;
  town: string;
  street: string;
  created_at: string;
}

/** Optional buyer info (if you later include it in schema) */
export interface OrderBuyerResponse {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
}

export interface OrderResponse {
  id: number;

  // ✅ backend uses buyer_id (not user_id)
  buyer_id: number;

  status: string; // pending, shipped, delivered, cancelled

  // ✅ backend returns these totals
  subtotal?: number;
  shipping_fee?: number;
  total_amount: number;

  // ✅ backend uses notes
  notes?: string | null;

  address_id?: number | null;

  // ✅ now included by admin route
  address?: AddressResponse | null;

  // optional (if you include buyer in schema)
  buyer?: OrderBuyerResponse | null;

  items: OrderItemResponse[];
  created_at: string;
  updated_at?: string;
}

export interface CheckoutInput {
  address_id: number;

  // ✅ backend expects notes (your router uses data.notes)
  notes?: string | null;

  // optional (ignored if backend doesn’t support)
  payment_method?: string | null;
}

/** Admin list filters (optional) */
export type AdminListOrdersArgs = {
  status?: string; // "pending" | "shipped" | "delivered" | "cancelled"
};

export const ordersAPI = createApi({
  reducerPath: "ordersAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Orders", "Order", "MyCart"],
  endpoints: (builder) => ({
    /** POST /orders/checkout */
    checkoutOrder: builder.mutation<OrderResponse, CheckoutInput>({
      query: (body) => ({
        url: "/orders/checkout",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["MyCart", { type: "Orders", id: "LIST" }],
    }),

    /** GET /orders/ (my orders) */
    listMyOrders: builder.query<OrderResponse[], void>({
      query: () => ({
        url: "/orders/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Orders", id: "LIST" },
              ...result.map((o) => ({ type: "Order" as const, id: o.id })),
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    /** GET /orders/{order_id} (my order) */
    getMyOrder: builder.query<OrderResponse, number>({
      query: (order_id) => ({
        url: `/orders/${order_id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, order_id) => [{ type: "Order", id: order_id }],
    }),

    /** ✅ GET /orders/admin/all (admin) */
    adminListAllOrders: builder.query<OrderResponse[], AdminListOrdersArgs | void>({
      query: (arg) => ({
        url: "/orders/admin/all",
        method: "GET",
        params: arg && arg.status ? { status: arg.status } : undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Orders", id: "LIST" },
              ...result.map((o) => ({ type: "Order" as const, id: o.id })),
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    /** ✅ PUT /orders/{order_id}/status?new_status=... (admin) */
    updateOrderStatus: builder.mutation<
      { message: string },
      { order_id: number; new_status: string }
    >({
      query: ({ order_id, new_status }) => ({
        url: `/orders/${order_id}/status`,
        method: "PUT",
        params: { new_status }, // IMPORTANT: query param, not JSON body
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Orders", id: "LIST" },
        { type: "Order", id: arg.order_id },
      ],
    }),
  }),
});

export const {
  useCheckoutOrderMutation,
  useListMyOrdersQuery,
  useGetMyOrderQuery,
  useAdminListAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersAPI;