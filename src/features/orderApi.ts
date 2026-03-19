import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
// import { baseQueryWithAuth } from "./baseQueryWitjauth"
import type { Order } from "./auth/types"
import url from "../url"

interface CompleteOrderRequest {
    orderId: number,
    client_data?: any,
    data: {
        download_link: string
        license_key: string
        admin_note: string
    }
}

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: url,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("access");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Orders"],

    endpoints: (builder) => ({

        // CREATE ORDER
        createOrder: builder.mutation<Order, any>({
            query: (data) => ({
                url: "/softwares/orders/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        // GET MY ORDERS
        getMyOrders: builder.query<Order[], void>({
            query: () => "/softwares/orders/",
            providesTags: ["Orders"],
        }),

        // COMPLETE ORDER (ADMIN)
        completeOrder: builder.mutation<void, CompleteOrderRequest>({
            query: ({ orderId, data }) => ({
                url: `/softwares/orders/${orderId}/complete_order/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        // CANCEL ORDER
        cancelOrder: builder.mutation<void, { orderId: string; data: any }>({
            query: ({ orderId, data }) => ({
                url: `/softwares/orders/${orderId}/cancel_order/`,
                method: "POST",
                body: data, // ✅ IMPORTANT
            }),
            invalidatesTags: ["Orders"],
        }),

    }),
})

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useCompleteOrderMutation,
    useCancelOrderMutation,
} = orderApi