export const selectCategories = (state) => state.categories;
export const selectFilter = (state) => state.filter;
export const selectCart = (state) => state.cart;
export const selectCartProducts = (state) => state.cart.cartProducts;
export const selectCartTotalSum = (state) => state.cart.cartTotalSum;
export const selectTaxes = (state) => state.cart.taxes;
export const selectAuthorization = (state) => state?.authLocal;
export const selectProducts = (state) => state.products;
export const selectSearch = (state) => state.search;
export const selectDetailedProduct = (state) => state.detailedProduct;
export const selectTotalSelected = (state) =>
  state.selectedQuantity.totalSelected;
export const selectMaxAvailable = (state) =>
  state.selectedQuantity.maxAvailable;
export const selectTotalRemain = (state) => state.selectedQuantity.totalRemain;
export const selectMainSelected = (state) =>
  state.selectedQuantity.mainSelected;
export const selectChildSelected = (state) =>
  state.selectedQuantity.childSelected;
export const selectSubcategories = (state) => state.subcategories;
export const selectReciept = (state) => state.reciept;
export const selectBuyStatus = (state) => state.buyStatus;
export const selectTerminalState = (state) => state.terminalState;
export const selectMerchant = (state) => state.merchant;

