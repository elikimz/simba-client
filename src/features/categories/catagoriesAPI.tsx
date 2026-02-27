// src/features/categories/categoriesAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** --------- Types --------- */
export interface CategoryCreateInput {
  name: string;
  description?: string | null;
}

export interface CategoryUpdateInput {
  name?: string | null;
  description?: string | null;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description?: string | null;
}

/** --------- API --------- */
export const categoriesAPI = createApi({
  reducerPath: "categoriesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Categories", "Category"],
  endpoints: (builder) => ({
    /** GET /categories/ */
    listCategories: builder.query<CategoryResponse[], void>({
      query: () => ({
        url: "/categories/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Categories", id: "LIST" },
              ...result.map((c) => ({ type: "Category" as const, id: c.id })),
            ]
          : [{ type: "Categories", id: "LIST" }],
    }),

    /** GET /categories/{category_id} */
    getCategory: builder.query<CategoryResponse, number>({
      query: (category_id) => ({
        url: `/categories/${category_id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, category_id) => [
        { type: "Category", id: category_id },
      ],
    }),

    /** POST /categories/ */
    createCategory: builder.mutation<CategoryResponse, CategoryCreateInput>({
      query: (body) => ({
        url: "/categories/",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
    }),

    /** PUT /categories/{category_id} */
    updateCategory: builder.mutation<
      CategoryResponse,
      { category_id: number; body: CategoryUpdateInput }
    >({
      query: ({ category_id, body }) => ({
        url: `/categories/${category_id}`,
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Categories", id: "LIST" },
        { type: "Category", id: arg.category_id },
      ],
    }),

    /** DELETE /categories/{category_id} */
    deleteCategory: builder.mutation<{ detail?: string } | void, number>({
      query: (category_id) => ({
        url: `/categories/${category_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, category_id) => [
        { type: "Categories", id: "LIST" },
        { type: "Category", id: category_id },
      ],
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesAPI;