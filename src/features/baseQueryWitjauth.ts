import {
  fetchBaseQuery,

} from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError
} from "@reduxjs/toolkit/query/react"
import url from "../url";
import { logout } from "../redux/slices/authSlice";
import { store } from "../app/store";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: url,

  prepareHeaders: (headers) => {

    const token = localStorage.getItem("access");
    // console.log(token)

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

/*
=========================
BASE QUERY WITH REFRESH
=========================
*/

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {

  let result = await baseQuery(args, api, extraOptions);

  /*
  =========================
  ACCESS TOKEN EXPIRED
  =========================
  */

  if (result.error && result.error.status === 401) {

    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      forceLogout();
      return result;
    }

    /*
    Try refreshing token
    */

    const refreshResult: any = await baseQuery(
      {
        url: "/auth/token/refresh/",
        method: "POST",
        body: {
          refresh: refreshToken,
        },
      },
      api,
      extraOptions
    );

    /*
    ========================
    REFRESH SUCCESS
    ========================
    */

    if (refreshResult.data) {

      const newAccess = refreshResult.data.access;

      localStorage.setItem("access", newAccess);

      /*
      Retry original request
      */

      result = await baseQuery(args, api, extraOptions);

    }

    /*
    ========================
    REFRESH FAILED
    ========================
    */

    else {
      forceLogout();
    }

  }

  return result;
};

/*
=========================
FORCE LOGOUT
=========================
*/

const forceLogout = () => {
  // Clear tokens
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  // Clear RTK Query cache 🔥 important
  

  // Update auth state
  store.dispatch(logout());

  // Show message
  toast.error("Session expired. Please login again.");

  // Redirect (small delay so toast is visible)
  setTimeout(() => {
    window.location.href = "/login?session=expired";
  }, 1500);
};