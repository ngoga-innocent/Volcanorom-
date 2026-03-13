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

const baseQuery = fetchBaseQuery({
  baseUrl: url,

  prepareHeaders: (headers) => {

    const token = localStorage.getItem("access");

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

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  store.dispatch(logout());

  window.location.href = "/login?session=expired";

};