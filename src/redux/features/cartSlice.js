import { createSlice } from "@reduxjs/toolkit";
import { collapseToast } from "react-toastify";
import { calculateTaxes } from "../../helper/calculateTaxes";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartProducts: [],
    // taxes: {
    //   withVATTotalSum: 0,
    //   noVATTotalSum: 0,
    //   VATSum: 0,
    //   exciseSum: 0,
    // },
    noVATProducts: [],
    VATProducts: [],
    separatePayment: false,
    cartTotalSum: 0,
    storeTaxConfig: {
      isSingleMerchant: null,
      useVATbyDefault: null,
    },
  },
  reducers: {
    addToCart: {
      reducer: (state, action) => {
        console.log("action.payload", action.payload);

        const { product, taxData } = action.payload;
        
        if (!state.separatePayment && state.cartProducts.length > 0) {
          console.log('state.cartProducts[state.cartProducts.length - 1].is_VAT_Excise', state.cartProducts[state.cartProducts.length - 1].is_VAT_Excise)
          console.log(' product.is_VAT_Excise',  product.is_VAT_Excise)
          state.separatePayment =
            state.cartProducts[state.cartProducts.length - 1].is_VAT_Excise !==
            product.is_VAT_Excise;
          console.log('state.separatePayment after change', state.separatePayment)
        }

        const isAdded = state.cartProducts.find(
          (item) => item.id === product.id && item.isComboParent !== true
        );

        if (isAdded) {
          isAdded.inCartQuantity += product.inCartQuantity;
        } else {
          state.cartProducts = [...state.cartProducts, product];
        }

        state.storeTaxConfig = taxData;

        if (state.cartProducts.length > 0) {
          // Calculate cart total sum
          state.cartTotalSum = state.cartProducts
            .reduce((total, p) => {
              console.log("product in state.cartProducts reduce", p);
              let price = p.priceAfterDiscount
                ? p.priceAfterDiscount
                : p.product_price;

              return total + price * p.inCartQuantity;
            }, 0)
            .toFixed(2);
          console.log("state.storeTaxConfig", state.storeTaxConfig);
          console.log("taxData", taxData);

          // let taxes = state.taxes;
          //If all products with VAT (isSingleMerchant === true)
          // All to LTD, all with VAT

          // taxes = calculateTaxes(
          //   state.cartProducts,
          //   state.storeTaxConfig.isSingleMerchant,
          //   state.storeTaxConfig.useVATbyDefault
          // );

          // Update state with calculated taxes
          // console.log("state.taxes.VATSum", state.taxes.VATSum);
          // console.log("taxes", taxes);

          // state.taxes = {
          //   withVATTotalSum: taxes.withVATTotalSum.toFixed(2),
          //   noVATTotalSum: taxes.noVATTotalSum.toFixed(2),
          //   VATSum: taxes.VATSum.toFixed(2),
          //   exciseSum: taxes.exciseSum.toFixed(2),
          // };
        } else {
          // Reset state if cart is empty
          state.cartTotalSum = 0;
          // state.taxes = {
          //   withVATTotalSum: 0,
          //   noVATTotalSum: 0,
          //   VATSum: 0,
          //   exciseSum: 0,
          // };
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

        // let taxes = state.taxes;
        //If all products with VAT (isSingleMerchant === true)
        // All to LTD, all with VAT

        // taxes = calculateTaxes(
        //   state.cartProducts,
        //   state.storeTaxConfig.isSingleMerchant,
        //   state.storeTaxConfig.useVATbyDefault
        // );
        // state.taxes = {
        //   withVATTotalSum: taxes.withVATTotalSum.toFixed(2),
        //   noVATTotalSum: taxes.noVATTotalSum.toFixed(2),
        //   VATSum: taxes.VATSum.toFixed(2),
        //   exciseSum: taxes.exciseSum.toFixed(2),
        // };
      } else {
        state.cartTotalSum = 0;
        // state.taxes = {
        //   withVATTotalSum: 0,
        //   noVATTotalSum: 0,
        //   VATSum: 0,
        //   exciseSum: 0,
        // };
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
        // let taxes = state.taxes;
        // Calculate taxes
        // const taxes = state.cartProducts.reduce(
        //   (totals, product) => {
        //     const price = product.priceAfterDiscount
        //       ? product.priceAfterDiscount
        //       : product.product_price;
        //     const discountValue = product.discountValue;
        //     if (!product.is_VAT_Excise) {
        //       // Accumulate total for products without VAT
        //       totals.noVATTotalSum += price * product.inCartQuantity;
        //     } else {
        //       // Accumulate total for products with VAT
        //       totals.withVATTotalSum += price * product.inCartQuantity;

        //       // Add VAT value
        //       const vatValue = parseFloat(product.VAT_value || 0);
        //       if (product.hasLowerPrice) {
        //         console.log("discountValue", discountValue);
        //         totals.VATSum +=
        //           parseFloat(state.taxes.VATSum) + vatValue * discountValue;
        //       } else {
        //         totals.VATSum += parseFloat(state.taxes.VATSum) + vatValue;
        //       }

        //       // Add excise value
        //       const exciseValue = parseFloat(product.excise_value || 0);
        //       totals.exciseSum += exciseValue * product.inCartQuantity;
        //     }
        //     console.log("totals", totals);
        //     return totals;
        //   },
        //   {
        //     withVATTotalSum: 0,
        //     noVATTotalSum: 0,
        //     VATSum: 0,
        //     exciseSum: 0,
        //   }
        // );
        // taxes = calculateTaxes(
        //   state.cartProducts,
        //   state.storeTaxConfig.isSingleMerchant,
        //   state.storeTaxConfig.useVATbyDefault
        // );
        // Update state with calculated taxes
        // state.taxes = {
        //   withVATTotalSum: taxes.withVATTotalSum.toFixed(2),
        //   noVATTotalSum: taxes.noVATTotalSum.toFixed(2),
        //   VATSum: taxes.VATSum.toFixed(2),
        //   exciseSum: taxes.exciseSum.toFixed(2),
        // };
      } else {
        state.cartTotalSum = 0;
        // state.taxes = {
        //   withVATTotalSum: 0,
        //   noVATTotalSum: 0,
        //   VATSum: 0,
        //   exciseSum: 0,
        // };
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
      console.log("product.inCartQuantity before +=1", product.inCartQuantity);
      product.inCartQuantity += 1;
      console.log("product.inCartQuantity after +=1", product.inCartQuantity);
      // Update the cartTotalSum
      if (state.cartProducts.length > 0) {
        state.cartTotalSum = state.cartProducts
          .reduce((total, product) => {
            let price = product.priceAfterDiscount
              ? product.priceAfterDiscount
              : product.product_price;

            console.log(
              "product.inCartQuantity in reducer",
              product.inCartQuantity
            );
            return total + price * product.inCartQuantity;
          }, 0)
          .toFixed(2);

        // const taxes = state.cartProducts.reduce(
        //   (totals, product) => {
        //     const price = product.priceAfterDiscount
        //       ? product.priceAfterDiscount
        //       : product.product_price;

        //     if (!product.is_VAT_Excise) {
        //       // Accumulate total for products without VAT
        //       const currentNoVATTotalSum = parseFloat(totals.noVATTotalSum);
        //       const newNoVATTotalSumValue =
        //         currentNoVATTotalSum + price * product.inCartQuantity;
        //       totals.noVATTotalSum = newNoVATTotalSumValue;
        //     } else {
        //       // Accumulate total for products with VAT
        //       totals.withVATTotalSum += price * product.inCartQuantity;

        //       // Add VAT value
        //       const vatValue = parseFloat(product.VAT_value || 0);
        //       console.log("vatValue", vatValue);
        //       console.log("before totals.VATSum", totals.VATSum);
        //       console.log("state.taxes.VATSum", state.taxes.VATSum);
        //       totals.VATSum += vatValue;
        //       console.log("after totals.VATSum", totals.VATSum);
        //       // Add excise value
        //       const exciseValue = parseFloat(product.excise_value || 0);
        //       totals.exciseSum += exciseValue * product.inCartQuantity;
        //     }
        //     console.log("totals", totals);
        //     return totals;
        //   },
        //   {
        //     withVATTotalSum: state.taxes.withVATTotalSum,
        //     noVATTotalSum: state.taxes.noVATTotalSum,
        //     VATSum: state.taxes.VATSum,
        //     exciseSum: state,
        //   }
        // );
        // let taxes = state.taxes;

        // taxes = calculateTaxes(
        //   state.cartProducts,
        //   state.storeTaxConfig.isSingleMerchant,
        //   state.storeTaxConfig.useVATbyDefault
        // );
        // Update state with calculated taxes
        // state.taxes = {
        //   withVATTotalSum: taxes.withVATTotalSum.toFixed(2),
        //   noVATTotalSum: taxes.noVATTotalSum.toFixed(2),
        //   VATSum: taxes.VATSum.toFixed(2),
        //   exciseSum: taxes.exciseSum.toFixed(2),
        // };
      } else {
        state.cartTotalSum = 0;
        // state.taxes = {
        //   withVATTotalSum: 0,
        //   noVATTotalSum: 0,
        //   VATSum: 0,
        //   exciseSum: 0,
        // };
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
        console.log(
          "product.inCartQuantity before -=1",
          product.inCartQuantity
        );
        product.inCartQuantity -= 1;
        console.log("product.inCartQuantity after -=1", product.inCartQuantity);
      }

      // Update the cartTotalSum
      if (state.cartProducts.length > 0) {
        state.cartTotalSum = state.cartProducts
          .reduce((total, product) => {
            // console.log("product", product);
            let price = product.priceAfterDiscount
              ? product.priceAfterDiscount
              : product.product_price;

            return total + price * product.inCartQuantity;
          }, 0)
          .toFixed(2);
        // let taxes = state.taxes;

        // taxes = calculateTaxes(
        //   state.cartProducts,
        //   state.storeTaxConfig.isSingleMerchant,
        //   state.storeTaxConfig.useVATbyDefault
        // );
        // const taxes = state.cartProducts.reduce(
        //   (totals, product) => {
        //     const price = product.priceAfterDiscount
        //       ? product.priceAfterDiscount
        //       : product.product_price;

        //     if (!product.is_VAT_Excise) {
        //       // Accumulate total for products without VAT
        //       totals.noVATTotalSum += price * product.inCartQuantity;
        //     } else {
        //       // Accumulate total for products with VAT
        //       totals.withVATTotalSum += price * product.inCartQuantity;

        //       // Add VAT value
        //       const vatValue = parseFloat(product.VAT_value || 0);
        //       totals.VATSum += vatValue; // Assuming 20% VAT

        //       // Add excise value
        //       const exciseValue = parseFloat(product.excise_value || 0);
        //       totals.exciseSum += exciseValue * product.inCartQuantity;
        //     }
        //     console.log("totals", totals);
        //     return totals;
        //   },
        //   {
        //     withVATTotalSum: 0,
        //     noVATTotalSum: 0,
        //     VATSum: 0,
        //     exciseSum: 0,
        //   }
        // );

        // Update state with calculated taxes
        // state.taxes = {
        //   withVATTotalSum: taxes.withVATTotalSum.toFixed(2),
        //   noVATTotalSum: taxes.noVATTotalSum.toFixed(2),
        //   VATSum: taxes.VATSum.toFixed(2),
        //   exciseSum: taxes.exciseSum.toFixed(2),
        // };
      } else {
        state.cartTotalSum = 0;
        // state.taxes = {
        //   withVATTotalSum: 0,
        //   noVATTotalSum: 0,
        //   VATSum: 0,
        //   exciseSum: 0,
        // };
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
        // state.withVATTotalSum = 0;
        // state.noVATTotalSum = 0;
        // state.VATSum = 0;
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
    // setProductCount: (state, action) => {
    //   const product = state.cartProducts.find(
    //     (item) => item.id === action.payload.id
    //   );
    //   product.inCartQuantity = action.payload.count;

    //   // Update the cartTotalSum
    //   if (state.cartProducts.length > 0) {
    //     state.cartTotalSum = state.cartProducts
    //       .reduce((total, product) => {
    //         console.log("product", product);
    //         let price = product.priceAfterDiscount
    //           ? product.priceAfterDiscount
    //           : product.product_price;
    //         if (product.is_VAT_Excise) {
    //           const vatAmount = (price * product.inCartQuantity * 0.2).toFixed(
    //             2
    //           );
    //           const withVATAmount = (price * product.inCartQuantity).toFixed(2);
    //           state.withVATTotalSum = (
    //             parseFloat(state.withVATTotalSum) + parseFloat(withVATAmount)
    //           ).toFixed(2);

    //           state.VATSum = (
    //             parseFloat(state.VATSum) + parseFloat(vatAmount)
    //           ).toFixed(2);
    //         } else {
    //           const noVATAmount = (price * product.inCartQuantity).toFixed(2);
    //           state.noVATTotalSum = (
    //             parseFloat(state.noVATTotalSum) + parseFloat(noVATAmount)
    //           ).toFixed(2);
    //         }
    //         return total + price * product.inCartQuantity;
    //       }, 0)
    //       .toFixed(2);
    //   } else {
    //     state.cartTotalSum = 0;
    //   }
    // },
    clearCart: (state) => {
      state.cartProducts = [];
      state.cartTotalSum = 0;
      // state.taxes = {
      //   withVATTotalSum: 0,
      //   noVATTotalSum: 0,
      //   VATSum: 0,
      //   exciseSum: 0,
      // };
    },
    setStoreCartTaxConfig: (state, action) => {
      console.log("setStoreCartTaxConfig action.payload", action.payload);
      // state.storeTaxConfig = action.payload;
    },
  },
});

export const {
  addToCart,
  addComboProductsToCart,
  removeFromCart,
  incrementProductsCount,
  decrementProductsCount,
  // setProductCount,
  clearCart,
  incrementComboProductsCount,
  decrementComboProductsCount,
  removeComboFromCart,
  setStoreCartTaxConfig,
} = cartSlice.actions;

export default cartSlice.reducer;
