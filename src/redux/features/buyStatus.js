import { createSlice } from "@reduxjs/toolkit";

const buyStatusSlice = createSlice({
  name: "buyStatus",
  initialState: {
    status: null,
    message: "",
    paymentCount: 1,
  },
  reducers: {
    setBuyStatus: (state, action) => {
      return (state = action.payload);
    },
    clearBuyStatus: (state) => {
      return (state = {
        status: null,
        message: "",
      });
    },
    setPaymentCount: (state, action) => {
      return (state = {
        ...state,
        paymentCount: action.payload,
      });
    },
    clearPaymentCount: (state) => {
      return (state = {
        ...state,
        paymentCount: 1,
      });
    },
  },
});

export const { setBuyStatus, clearBuyStatus, setPaymentCount, clearPaymentCount } =
  buyStatusSlice.actions;

export default buyStatusSlice.reducer;
