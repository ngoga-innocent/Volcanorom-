import { createApi } from "@reduxjs/toolkit/query/react";
// import url from "../url";
import type { Transaction, UserProfile } from "./auth/types";
import { baseQueryWithAuth } from "./baseQueryWitjauth";


export const AdminApi = createApi({
  reducerPath: "api",
  baseQuery:baseQueryWithAuth,

//   baseQuery: fetchBaseQuery({
//     baseUrl: url,

//     prepareHeaders: (headers) => {
//       if (typeof window !== "undefined") {
//         const token = localStorage.getItem("access");

//         if (token) {
//           headers.set("Authorization", `Bearer ${token}`);
//         }
//       }

//       headers.set("Content-Type", "application/json");

//       return headers;
//     },
//   }),

  tagTypes: ["Users", "Transactions"],

  endpoints: (builder) => ({

    /*
    =========================
    USERS
    =========================
    */

    getUsers: builder.query<UserProfile[], void>({
      query: () => "/dashboard/users/",
      providesTags: ["Users"],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/dashboard/users/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<UserProfile, { id: number; data: Partial<UserProfile> }>({
      query: ({ id, data }) => ({
        url: `/dashboard/users/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    /*
    =========================
    TRANSACTIONS
    =========================
    */

    getTransactions: builder.query<Transaction[], void>({
      query: () => "/dashboard/transactions/",
      providesTags: ["Transactions"],
    }),

    approveTransaction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/dashboard/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["Transactions", "Users"],
    }),

    rejectTransaction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/dashboard/reject/${id}/`,
        method: "POST",
      }),
      invalidatesTags: ["Transactions"],
    }),

  }),
});
export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetTransactionsQuery,
  useApproveTransactionMutation,
  useRejectTransactionMutation,
} = AdminApi;