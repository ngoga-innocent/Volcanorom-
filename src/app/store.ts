import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import authReducer from "../redux/slices/authSlice"
import { AdminApi } from "../features/adminApi";
import { softwareApi } from "../features/softwareApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [AdminApi.reducerPath]: AdminApi.reducer,
    [softwareApi.reducerPath]: softwareApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(AdminApi.middleware).concat(softwareApi.middleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;