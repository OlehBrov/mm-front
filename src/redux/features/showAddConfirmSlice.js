import { createSlice } from "@reduxjs/toolkit";


export const showAddConfirmSlice = createSlice({
  name: "showAddConfirm",
  initialState: false,
  reducers: {
    setShowAddProductsConfirm: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setShowAddProductsConfirm } = showAddConfirmSlice.actions;

export default showAddConfirmSlice.reducer;
