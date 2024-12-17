import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartProducts: [],
    cartTotalSum: 0,
  },
  reducers: {
    addToCart: {
      reducer: (state, action) => {
        const isAdded = state.cartProducts.find(
          (item) => item.id === action.payload.id && item.isComboParent !== true
        );

        if (isAdded) {
          isAdded.inCartQuantity += action.payload.inCartQuantity;
        } else {
          state.cartProducts.push(action.payload);
        }

        // Update the cartTotalSum
        if (state.cartProducts.length > 0) {
          state.cartTotalSum = state.cartProducts
            .reduce((total, product) => {
              let price = product.priceAfterDiscount
                ? product.priceAfterDiscount
                : product.product_price;
              return total + price * product.inCartQuantity;
            }, 0)
            .toFixed(2);
        } else {
          state.cartTotalSum = 0;
        }
      },
    },
    addComboProductsToCart: (state, action) => {
      console.log("addComboProductsToCart action.payload", action.payload);
      const { parent, child } = action.payload;
      const isAdded = state.cartProducts.find(
        (item) => item.id === parent.id && item.isComboParent === true
      );

      if (isAdded) {
        const childProductId = isAdded.productsChildProduct.id;
        const comboChildProduct = state.cartProducts.find(
          (item) => item.id === childProductId && item.isComboChild
        );
        isAdded.inCartQuantity += parent.inCartQuantity;
        comboChildProduct.inCartQuantity += child.inCartQuantity;
        console.log("addComboProductsToCart isAdded", isAdded);
      } else {
        state.cartProducts.push(parent);
        state.cartProducts.push(child);
      }

      // Update the cartTotalSum
      if (state.cartProducts.length > 0) {
        state.cartTotalSum = state.cartProducts
          .reduce((total, product) => {
            console.log("addComboProductsToCart product", product);
            let price = product.priceAfterDiscount
              ? product.priceAfterDiscount
              : product.product_price;
            return total + price * product.inCartQuantity;
          }, 0)
          .toFixed(2);
      } else {
        state.cartTotalSum = 0;
      }
    },

    removeFromCart: (state, action) => {
      state.cartProducts = state.cartProducts.filter(
        (item) =>
          item.id !== action.payload ||
          item.isComboParent === true ||
          item.isComboChild === true
      );

      // Update the cart total sum
      if (state.cartProducts.length > 0) {
        state.cartTotalSum = state.cartProducts
          .reduce((total, product) => {
            const price = product.priceAfterDiscount || product.product_price;
            return total + price * product.inCartQuantity;
          }, 0)
          .toFixed(2);
      } else {
        state.cartTotalSum = 0;
      }
    },

    removeComboFromCart: (state, action) => {
      const comboProduct = state.cartProducts.find(
        (item) => item.id === action.payload && item.isComboParent === true
      );

      if (comboProduct) {
        const childProductId = comboProduct.productsChildProduct?.id;

        state.cartProducts = state.cartProducts.filter(
          (item) =>
            !(item.id === comboProduct.id && item.isComboParent) &&
            !(item.id === childProductId && item.isComboChild)
        );

        // Update the cart total sum
        state.cartTotalSum = state.cartProducts
          .reduce((total, product) => {
            const price = product.priceAfterDiscount || product.product_price;
            return total + price * product.inCartQuantity;
          }, 0)
          .toFixed(2);
      }
    },

    incrementProductsCount: (state, action) => {
      const product = state.cartProducts.find(
        (item) => item.id === action.payload
      );
      product.inCartQuantity += 1;

      // Update the cartTotalSum
      if (state.cartProducts.length > 0) {
        state.cartTotalSum = state.cartProducts
          .reduce((total, product) => {
           
            let price = product.priceAfterDiscount
              ? product.priceAfterDiscount
              : product.product_price;
            return total + price * product.inCartQuantity;
          }, 0)
          .toFixed(2);
      } else {
        state.cartTotalSum = 0;
      }
    },
    decrementProductsCount: (state, action) => {
      const product = state.cartProducts.find(
        (item) => item.id === action.payload
      );
      if (product.inCartQuantity === 1) {
        state.cartProducts = state.cartProducts.filter(
          (item) => item.id !== action.payload
        );
      } else {
        product.inCartQuantity -= 1;
      }

      // Update the cartTotalSum
      if (state.cartProducts.length > 0) {
        state.cartTotalSum = state.cartProducts
          .reduce((total, product) => {
            console.log("product", product);
            let price = product.priceAfterDiscount
              ? product.priceAfterDiscount
              : product.product_price;
            return total + price * product.inCartQuantity;
          }, 0)
          .toFixed(2);
      } else {
        state.cartTotalSum = 0;
      }
    },
    incrementComboProductsCount: (state, action) => {
      const comboProduct = state.cartProducts.find(
        (item) => item.id === action.payload
      );
      comboProduct.inCartQuantity += 1;
      const childProductId = comboProduct.productsChildProduct.id;
      const comboChildProduct = state.cartProducts.find(
        (item) => item.id === childProductId && item.isComboChild
      );
      console.log("comboChildProduct", comboChildProduct);
      comboChildProduct.inCartQuantity += 1;
      if (state.cartProducts.length > 0) {
        state.cartTotalSum = state.cartProducts
          .reduce((total, product) => {
            console.log("product", product);
            let price = product.priceAfterDiscount
              ? product.priceAfterDiscount
              : product.product_price;
            return total + price * product.inCartQuantity;
          }, 0)
          .toFixed(2);
      } else {
        state.cartTotalSum = 0;
      }
    },
    decrementComboProductsCount: (state, action) => {
      const comboProduct = state.cartProducts.find(
        (item) => item.id === action.payload
      );

      const childProductId = comboProduct.productsChildProduct.id;
      const comboChildProduct = state.cartProducts.find(
        (item) => item.id === childProductId && item.isComboChild
      );

      if (comboProduct.inCartQuantity === 1) {
        state.cartProducts = state.cartProducts.filter(
          (item) => item.id !== comboProduct.id
        );
        state.cartProducts = state.cartProducts.filter(
          (item) => item.id !== comboChildProduct.id
        );
      } else {
        comboProduct.inCartQuantity -= 1;
        comboChildProduct.inCartQuantity -= 1;
      }

      if (state.cartProducts.length > 0) {
        state.cartTotalSum = state.cartProducts
          .reduce((total, product) => {
            let price = product.priceAfterDiscount
              ? product.priceAfterDiscount
              : product.product_price;
            return total + price * product.inCartQuantity;
          }, 0)
          .toFixed(2);
      } else {
        state.cartTotalSum = 0;
      }
    },
    setProductCount: (state, action) => {
      const product = state.cartProducts.find(
        (item) => item.id === action.payload.id
      );
      product.inCartQuantity = action.payload.count;

      // Update the cartTotalSum
      if (state.cartProducts.length > 0) {
        state.cartTotalSum = state.cartProducts
          .reduce((total, product) => {
            console.log("product", product);
            let price = product.priceAfterDiscount
              ? product.priceAfterDiscount
              : product.product_price;
            return total + price * product.inCartQuantity;
          }, 0)
          .toFixed(2);
      } else {
        state.cartTotalSum = 0;
      }
    },
    clearCart: (state) => {
      state.cartProducts = [];
      state.cartTotalSum = 0;
    },
  },
});

export const {
  addToCart,
  addComboProductsToCart,
  removeFromCart,
  incrementProductsCount,
  decrementProductsCount,
  setProductCount,
  clearCart,
  incrementComboProductsCount,
  decrementComboProductsCount,
  removeComboFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
