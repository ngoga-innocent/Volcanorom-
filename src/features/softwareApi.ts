import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWitjauth";

export const softwareApi = createApi({

  reducerPath: "softwareApi",

  baseQuery: baseQueryWithAuth,

  tagTypes: ["Software"],

  endpoints: (builder) => ({

    getSoftwares: builder.query({
      query: () => "softwares/softs/",
      providesTags: ["Software"],
    }),

    getSoftware: builder.query({
      query: (id) => `softwares/softs/${id}/`,
    }),

    createSoftware: builder.mutation({
      query: (data) => ({
        url: "softwares/softs/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Software"],
    }),

    updateSoftware: builder.mutation({
      query: ({ id, data }) => ({
        url: `softwares/softs/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Software"],
    }),

    deleteSoftware: builder.mutation({
      query: (id) => ({
        url: `softwares/softs/${id}/`,
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