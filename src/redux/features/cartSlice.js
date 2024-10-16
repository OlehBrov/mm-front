import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: {
      reducer: (state, action) => {
        const isAdded = state.find(
          (item) => item.id === action.payload.id
        );

        if (isAdded) {
          isAdded.inCartQuantity += action.payload.inCartQuantity;
        } else state.push(action.payload);
      },
    },
    removeFromCart: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
    incrementProductsCount: (state, action) => {
      const product = state.find((item) => item.id === action.payload);
      product.inCartQuantity += 1;
    },
    decrementProductsCount: (state, action) => {
      const product = state.find((item) => item.id === action.payload);
      if (product.inCartQuantity === 1) {
        return state.filter((item) => item.id !== action.payload);
      } else product.inCartQuantity = product.inCartQuantity - 1;
    },
    setProductCount: (state, action) => {
      const product = state.find(
        (item) => item.id === action.payload.id
      );
      product.inCartQuantity = action.payload.count;
    },
    clearCart: (state) => {
      return (state = []);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementProductsCount,
  decrementProductsCount,
  setProductCount,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
