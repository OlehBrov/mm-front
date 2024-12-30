import { createSlice } from "@reduxjs/toolkit";

const authorizationSlice = createSlice({
  name: "authLocal",
  initialState: {
    store_id: 0,
    isLoggedIn: false,
    auth_id: "",
    token: "",
    refreshToken: "",
    role: "",
   
  },
  reducers: {
    logInStore: (state, { payload }) => {
      state.store_id = payload.store_id;
      state.isLoggedIn = true;
      state.auth_id = payload.auth_id;
      state.token = payload.token;
      state.refreshToken = payload.refreshToken;
      state.role = payload.role;
     
    },
    logOutStore: (state) => {
      state.isLoggedIn = false;
      state.auth_id = "";
      state.token = "";
      state.role = "";
      state.store_id = 0;
    },
    refreshAccessToken: (state, { payload }) => {
    
      if (payload && payload.token) {
        state.token = payload.token;
      } else {
        console.error(
          "Invalid payload received for refreshAccessToken:",
          payload
        );
      }

      console.log("After updating token:", state);
    },
  },
});
export const { logInStore, logOutStore, refreshAccessToken } =
  authorizationSlice.actions;
export default authorizationSlice.reducer;
