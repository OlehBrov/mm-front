import { createSlice } from "@reduxjs/toolkit";
import { storeApi } from "../../api/storeApi";

export const productsSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {
    setProducts: (state, action) => {
      return action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      storeApi.endpoints.getAllProducts.matchPending,
      (state, action) => {
        // Handle pending state if needed
      }
    );
    builder.addMatcher(
      storeApi.endpoints.getAllProducts.matchFulfilled,
      (state, action) => {
        return action.payload.data;
      }
    );
    builder.addMatcher(
      storeApi.endpoints.getAllProducts.matchRejected,
      (state, action) => {
        // Handle rejection if needed
      }
    );
  },
});

export const { setProducts } = productsSlice.actions;

export default productsSlice.reducer;
