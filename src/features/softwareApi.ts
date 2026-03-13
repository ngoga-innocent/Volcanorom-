import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWitjauth";

export const softwareApi = createApi({
  reducerPath: "softwareApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Software"],

  endpoints: (builder) => ({

    getSoftwares: builder.query({
      query: () => "software/",
      providesTags: ["Software"],
    }),

    getSoftware: builder.query({
      query: (id) => `software/${id}/`,
    }),

    createSoftware: builder.mutation({
      query: (data) => ({
        url: "software/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Software"],
    }),

    updateSoftware: builder.mutation({
      query: ({ id, data }) => ({
        url: `software/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Software"],
    }),

    deleteSoftware: builder.mutation({
      query: (id) => ({
        url: `software/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Software"],
    }),
  }),
});

export const {
  useGetSoftwaresQuery,
  useGetSoftwareQuery,
  useCreateSoftwareMutation,
  useUpdateSoftwareMutation,
  useDeleteSoftwareMutation,
} = softwareApi;