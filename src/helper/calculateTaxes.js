export const calculateTaxes = (
  cartProducts,
  isSingleMerchant,
  useVATbyDefault
) => {

  return cartProducts.reduce(
    (totals, product) => {
      const price = product.priceAfterDiscount
        ? product.priceAfterDiscount
        : product.product_price;
      const discountValue = product.discountValue || 0;

      if (isSingleMerchant && useVATbyDefault) {
        // Case 1: All to LTD, all with VAT
        totals.noVATTotalSum = 0; // No products without VAT
        totals.withVATTotalSum += price * product.inCartQuantity;

        const vatValue = parseFloat(product.VAT_value || 0);
        if (product.hasLowerPrice) {
          const vatDiscount = vatValue * discountValue;
          totals.VATSum += vatValue - vatDiscount;
        } else {
          totals.VATSum += vatValue;
        }

        const exciseValue = parseFloat(product.excise_value || 0);
        totals.exciseSum += exciseValue * product.inCartQuantity;
      } else if (isSingleMerchant && !useVATbyDefault) {
        // Case 2: All from FOP, all without VAT
        totals.withVATTotalSum = 0; // No products with VAT
        totals.noVATTotalSum += price * product.inCartQuantity;
        totals.VATSum = 0; // No VAT
        const exciseValue = parseFloat(product.excise_value || 0);
        totals.exciseSum += exciseValue * product.inCartQuantity;
      } else if (!isSingleMerchant && !useVATbyDefault) {
        console.log(" VAT to LTD, without VAT to FOP");
        // Case 3: VAT to LTD, without VAT to FOP

        if (!product.is_VAT_Excise) {
          totals.noVATTotalSum += price * product.inCartQuantity;
        } else {
          totals.withVATTotalSum += price * product.inCartQuantity;

          const vatValue = parseFloat(product.VAT_value || 0);
          if (product.hasLowerPrice) {
            const vatDiscount = vatValue * discountValue;

            totals.VATSum += (vatValue - vatDiscount) * product.inCartQuantity;
          } else {
            totals.VATSum += vatValue * product.inCartQuantity;
          }

          const exciseValue = parseFloat(product.excise_value || 0);
          totals.exciseSum += exciseValue * product.inCartQuantity;
        }
      }
      
      return totals;
    },
    {
      withVATTotalSum: 0,
      noVATTotalSum: 0,
      VATSum: 0,
      exciseSum: 0,
    }
  );
};
