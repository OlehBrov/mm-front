import { createSlice } from "@reduxjs/toolkit";

const recieptSlice = createSlice({
  name: "reciept",
  initialState: {},
  reducers: {
    setReciept: (state, action) => {
      return (state = action.payload);
    },
    clearReciept: (state) => {
      return (state = {});
    },
  },
});

export const { setReciept, clearReciept } = recieptSlice.actions;

export default recieptSlice.reducer;
