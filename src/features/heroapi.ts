import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWitjauth";

/* TYPES */
export interface HeroSlide {
  id: number;
  image: string;
  is_active: boolean;
  order: number;
  title?: string;
  subtitle?: string;
}

export const heroApi = createApi({
  reducerPath: "heroApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Hero"],
  endpoints: (builder) => ({
    
    /* PUBLIC */
    getHeroCarousel: builder.query<HeroSlide[], void>({
      query: () => "/api/hero-carousel/",
      providesTags: ["Hero"],
    }),

    /* ADMIN LIST */
    getAdminHeroCarousel: builder.query<HeroSlide[], void>({
      query: () => "/api/admin/hero-carousel/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Hero" as const, id })),
              { type: "Hero", id: "LIST" },
            ]
          : [{ type: "Hero", id: "LIST" }],
    }),

    /* CREATE */
    createHeroCarousel: builder.mutation<HeroSlide, FormData>({
      query: (data) => ({
        url: "/api/admin/hero-carousel/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Hero", id: "LIST" }],
    }),

    /* UPDATE */
    updateHeroCarousel: builder.mutation<
      HeroSlide,
      Partial<HeroSlide> & { id: number }
    >({
      query: ({ id, ...data }) => ({
        url: `/api/admin/hero-carousel/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Hero", id: arg.id },
        { type: "Hero", id: "LIST" },
      ],
    }),

    /* DELETE */
    deleteHeroCarousel: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/hero-carousel/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Hero", id },
        { type: "Hero", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetHeroCarouselQuery,
  useGetAdminHeroCarouselQuery,
  useCreateHeroCarouselMutation,
  useUpdateHeroCarouselMutation,
  useDeleteHeroCarouselMutation,
} = heroApi;