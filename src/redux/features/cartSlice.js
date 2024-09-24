import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: {
      reducer: (state, action) => {
        const isAdded = state.find(
          (item) => item.product_id === action.payload.product_id
        );

        if (isAdded) {
          isAdded.total += 1;
        } else state.push(action.payload);
      },
      prepare: (product) => {
        console.log("product", product);
        const total = 1;
        return { payload: { ...product, total } };
      },
    },
    removeFromCart: (state, action) => {
      return state.filter((item) => item.product_id !== action.payload);
    },
    incrementProductsCount: (state, action) => {
      const product = state.find((item) => item.product_id === action.payload);
      product.total += 1;
    },
    decrementProductsCount: (state, action) => {
      const product = state.find((item) => item.product_id === action.payload);
      if (product.total === 1) {
        return state.filter((item) => item.product_id !== action.payload);
      } else product.total = product.total - 1;
    },
    setProductCount: (state, action) => {
      const product = state.find(
        (item) => item.product_id === action.payload.product_id
      );
      product.total = action.payload.count;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementProductsCount,
  decrementProductsCount,
  setProductCount,
} = cartSlice.actions;

export default cartSlice.reducer;
