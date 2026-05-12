import {createApi} from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuth } from "../baseQueryWitjauth";

export const announcementApi = createApi({
   reducerPath:"Announcement",
   tagTypes: ["Announcements"],
   baseQuery:baseQueryWithAuth, 
  endpoints: (builder) => ({
    getActiveAnnouncement: builder.query<any,void>({
      query: () => "/dashboard/announcements/active/",
      providesTags: ["Announcements"],
    }),

    getAnnouncements: builder.query<any[],void>({
      query: () => "/dashboard/announcements/",
      providesTags: ["Announcements"],
    }),

    createAnnouncement: builder.mutation({
      query: (data) => ({
        url: "/dashboard/announcements/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Announcements"],
    }),

    updateAnnouncement: builder.mutation({
      query: ({ id, data }) => ({
        url: `/dashboard/announcements/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Announcements"],
    }),

    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/dashboard/announcements/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcements"],
    }),
  }),
});

export const {
  useGetActiveAnnouncementQuery,
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;