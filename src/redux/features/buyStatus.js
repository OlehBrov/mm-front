import { createSlice } from "@reduxjs/toolkit";

const buyStatusSlice = createSlice({
  name: "buyStatus",
  initialState: {
    status: null,
    message: "",
  },
  reducers: {
    setBuyStatus: (state, action) => {
      return (state = action.payload);
    },
    clearBuyStatus: (state) => {
      return state = {
        status: null,
        message: "",
      }; 
    },
  },
});

export const { setBuyStatus, clearBuyStatus } = buyStatusSlice.actions;

export default buyStatusSlice.reducer;
