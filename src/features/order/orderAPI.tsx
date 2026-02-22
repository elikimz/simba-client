// src/features/orders/ordersAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** --------- Types --------- */
export interface OrderItemResponse {
  id: number;
  product_id: number;
  product_name?: string | null;
  product_price?: number | null;
  product_image_url?: string | null;
  quantity: number;
  line_total?: number | null;
}

export interface OrderResponse {
  id: number;
  user_id: number;
  status: string; // e.g. pending, paid, shipped, delivered, cancelled
  total_amount: number;
  address_id?: number | null;
  items: OrderItemResponse[];
  created_at: string; // datetime ISO string
  updated_at?: string; // datetime ISO string (if backend returns)
}

export interface CheckoutInput {
  address_id: number; // selected delivery address
  note?: string | null; // optional
  payment_method?: string | null; // optional
}

export interface UpdateOrderStatusInput {
  status: string;
}

/** --------- API --------- */
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
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["MyCart", { type: "Orders", id: "LIST" }],
    }),

    /** GET /orders/ */
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

    /** GET /orders/{order_id} */
    getMyOrder: builder.query<OrderResponse, number>({
      query: (order_id) => ({
        url: `/orders/${order_id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, order_id) => [{ type: "Order", id: order_id }],
    }),

    /** PUT /orders/{order_id}/status (Admin) */
    updateOrderStatus: builder.mutation<
      OrderResponse,
      { order_id: number; body: UpdateOrderStatusInput }
    >({
      query: ({ order_id, body }) => ({
        url: `/orders/${order_id}/status`,
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
        },
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
  useUpdateOrderStatusMutation,
} = ordersAPI;