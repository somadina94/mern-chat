import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
