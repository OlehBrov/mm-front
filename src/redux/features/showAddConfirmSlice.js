import { createSlice } from "@reduxjs/toolkit";

export const showAddConfirmSlice = createSlice({
  name: "showAddConfirm",
  initialState: {
    show: false,
    product: null,
    isSuccess: false,
    message: "",
  },
  reducers: {
    setShowAddProductsConfirm: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setShowAddProductsConfirm } = showAddConfirmSlice.actions;

export default showAddConfirmSlice.reducer;
