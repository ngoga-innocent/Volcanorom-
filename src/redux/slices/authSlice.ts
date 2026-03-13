import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"
interface AuthState {
  access: string | null;
  refresh: string | null;
  user: any | null;
}

const initialState: AuthState = {
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ access: string; refresh: string }>
    ) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      
      localStorage.setItem("access", action.payload.access);
      localStorage.setItem("refresh", action.payload.refresh);
      
    },

    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.access = null;
      state.refresh = null;
      state.user = null;

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
  },
});

export const { setCredentials, logout, setUser } = authSlice.actions;
export default authSlice.reducer;