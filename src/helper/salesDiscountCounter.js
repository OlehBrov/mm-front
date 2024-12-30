import moment from "moment";

// Helper to determine if marker should be shown
export const shouldShowMarker = (product) => {
// console.log('shouldShowMarker product', product)
  const { sale_id } = product;
  if (sale_id === 1 || sale_id === 2) {
    const expDays = calculateDaysLeft(product);

    return expDays < 4;
  }
  if (sale_id === 7) {

    if (!product.ComboProducts_Products_combo_idToComboProducts) {
       return false;
    }
    const childQuantity =
      product.ComboProducts_Products_combo_idToComboProducts
        .Products_ComboProducts_child_product_idToProducts.product_left;
    if (Number(childQuantity) === 0 || isNaN(Number(childQuantity))) {
      return false;
    }
    return true;
  }
  if (sale_id && sale_id !== 0) return true;
  return false;
};

// Helper to calculate the new price and the discount to apply
export const calculateDiscount = (product, daysLeft) => {
  const { sale_id, Sales } = product;
  let discount = 0;

  if (sale_id === 1 || sale_id === 2) {
    // Discount based on days left for sale_id 1 and 2
    if (daysLeft === 3) {
      discount = parseFloat(Sales.sale_discount_1);
    } else if (daysLeft === 2) {
      discount = parseFloat(Sales.sale_discount_2);
    } else if (daysLeft < 2) {
      discount = parseFloat(Sales.sale_discount_3);
    }
  } else if (sale_id === 3 || sale_id === 4 || sale_id === 6 || sale_id === 9) {
    // Fixed discount for sale_id 3, 4, 6
    discount = parseFloat(Sales.sale_discount_1);
  }

  return discount;
};

// Helper to calculate new price after applying the discount
export const calculateNewPrice = (product, discount) => {
  const price = parseFloat(product.product_price);
  return discount > 0
    ? (price - price * discount).toFixed(2)
    : price.toFixed(2);
};

// Helper to calculate the number of days left based on load_date and exposition_term
export const calculateDaysLeft = (product) => {
  const loadDate = moment(product.LoadProducts_LoadProducts_product_idToProducts[0]?.load_date);
  const now = moment();
  const expirationDate = loadDate.add(product.exposition_term, "days");

  return expirationDate.diff(now, "days");
};
