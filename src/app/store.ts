import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import authReducer from "../redux/slices/authSlice"
import { AdminApi } from "../features/adminApi";
import { softwareApi } from "../features/softwareApi";
import { orderApi } from "../features/orderApi";
import { heroApi } from "../features/heroapi";
import { announcementApi } from "../features/auth/announcementApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [AdminApi.reducerPath]: AdminApi.reducer,
    [softwareApi.reducerPath]: softwareApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [heroApi.reducerPath]: heroApi.reducer,
    [announcementApi.reducerPath]:announcementApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(AdminApi.middleware).concat(softwareApi.middleware).concat(orderApi.middleware).concat(heroApi.middleware).concat(announcementApi.middleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;