import React, { useEffect, useState } from "react";
import { MinusIcon } from "./icons/MinusIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { useDispatch, useSelector } from "react-redux";
import { addComboProductsToCart, addToCart } from "../redux/features/cartSlice";
import { useGetProductByIdQuery } from "../api/storeApi";
import {
  incrementTotalSelected,
  decrementTotalSelected,
  incrementChildSelected,
  decrementChildSelected,
} from "../redux/features/selectedQuantitySlice";
import {
  selectTotalSelected,
  selectMaxAvailable,
  selectTotalRemain,
  selectChildSelected,
} from "../redux/selectors/selectors";
import { useNavigate } from "react-router-dom";

export const ComboProduct = ({
  parentProduct,
  productQtyAvailable,
  setProductQtyAvailable,
  state,
}) => {
  const totalSelected = useSelector(selectTotalSelected);
  const maxAvailableMainProduct = useSelector(selectMaxAvailable);
  const totalRemain = useSelector(selectTotalRemain);
  const totalChildSelected = useSelector(selectChildSelected);

  const dispatch = useDispatch();

  //   const [productQty, setProductQty] = useState(0);
  const [comboDiscount, setComboDiscount] = useState(0);
  const [parentPrice, setParentPrice] = useState({});
  const [childPrice, setChildPrice] = useState({});

  const [totalPairPrice, setTotalPairPrice] = useState(0);
  const [maxPairsAvailable, setMaxPairsAvailable] = useState(1);
  const [disableIncrease, setDisableIncrease] = useState(false);
  const [disableDecrease, setDisableDecrease] = useState(true);

  const { currentData: childProduct, isSuccess } = useGetProductByIdQuery({
    comboId: parentProduct.combo_id,
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      const availableChildQty = Number(
        childProduct?.childProduct?.product_left
      );
      const maxAvailablePairs = Math.min(
        maxAvailableMainProduct,
        availableChildQty
      );

      setMaxPairsAvailable(maxAvailablePairs);
      //   setProductQty(totalChildSelected);
      setComboDiscount(parentProduct.Sales.sale_discount_1 * 100);

      const parentPriceData = comboPriceCounter(
        parentProduct.product_price,
        parentProduct.Sales.sale_discount_1
      );
      const childPriceData = comboPriceCounter(
        childProduct.childProduct.product_price,
        parentProduct.Sales.sale_discount_1
      );

      setParentPrice(parentPriceData);
      setChildPrice(childPriceData);
    }
  }, [parentProduct, childProduct, productQtyAvailable, isSuccess]);

  useEffect(() => {
    if (parentPrice.priceAfterDiscount && childPrice.priceAfterDiscount) {
      setTotalPairPrice(() => {
        const total =
          Number(parentPrice.priceAfterDiscount) +
          Number(childPrice.priceAfterDiscount);
        return total.toFixed(2);
      });
    }
  }, [parentPrice, childPrice]);

  useEffect(() => {
    setDisableIncrease(
      totalChildSelected >= maxPairsAvailable ||
        totalSelected >= maxAvailableMainProduct
    );
    setDisableDecrease(totalChildSelected <= 0);
  }, [maxPairsAvailable, totalSelected, maxAvailableMainProduct, totalRemain]);

  const comboPriceCounter = (price, discount) => {
    const intPrice = parseFloat(price);
    const intDiscount = parseFloat(discount);
    const newPrice = intPrice - intPrice * intDiscount;
    const priceDecrement = intPrice - newPrice;
    return {
      priceAfterDiscount: newPrice.toFixed(2),
      priceDifference: (intPrice * intDiscount).toFixed(2),
      priceDecrement: priceDecrement.toFixed(2),
    };
  };

    const modifierHandler = () => {
      // console.log('totalChildSelected', totalChildSelected)
    dispatch(
      addComboProductsToCart({
        parent: {
          ...parentProduct,
          inCartQuantity: totalChildSelected,
          priceAfterDiscount: parentPrice.priceAfterDiscount,
          priceDecrement: parentPrice.priceDecrement,
          isComboParent: true,
          productsChildProduct: {
            ...childProduct.childProduct,
            inCartQuantity: totalChildSelected,
            priceAfterDiscount: childPrice.priceAfterDiscount,
            priceDecrement: childPrice.priceDecrement,
          },
        },
        child: {
          ...childProduct.childProduct,
          inCartQuantity: totalChildSelected,
          priceAfterDiscount: childPrice.priceAfterDiscount,
          priceDecrement: childPrice.priceDecrement,
          isComboChild: true,
        },
      })
    );

    // setProductQty(0); // Reset quantity state
    navigate(state.from.location);
  };

  const handleProductIncrease = () => {
    if (
      totalChildSelected < maxPairsAvailable &&
      totalSelected < maxAvailableMainProduct
    ) {
      //   setProductQty((prev) => prev + 1);
      dispatch(incrementChildSelected(1));
    }
  };

  const handleProductDecrease = () => {
    if (totalChildSelected > 0) {
      //   setProductQty((prev) => prev - 1);
      dispatch(decrementChildSelected(1));
    }
  };

  return (
    <>
      {isSuccess && (
        <div className="combo-products-wrapper">
          <div className="combo-products-grid">
            <div className="combo-products-details-wrapper">
              <div className="combo-product-card">
                <div className="combo-product-image-wrap">
                  <img src={parentProduct.product_image} alt="" />
                </div>
                <p className="combo-product-name">
                  {parentProduct.product_name}
                </p>
                <div className="combo-prices-wrapper">
                  <p className="product-card-light-text combo-price crossed">
                    {parentProduct.product_price} грн.
                    <span className="combo-discount-popup">{`-${comboDiscount}%`}</span>
                  </p>
                  <p className="product-card-light-text combo-price">
                    {parentPrice.priceAfterDiscount} грн.
                  </p>
                </div>
              </div>
              <div className="combo-product-card">
                <div className="combo-product-image-wrap">
                  <img src={childProduct.childProduct.product_image} alt="" />
                </div>
                <p className="combo-product-name">
                  {childProduct.childProduct.product_name}
                </p>
                <div className="combo-prices-wrapper">
                  <p className="product-card-light-text combo-price crossed">
                    {childProduct.childProduct.product_price} грн.
                    <span className="combo-discount-popup">{`-${comboDiscount}%`}</span>
                  </p>
                  <p className="product-card-light-text combo-price">
                    {childPrice.priceAfterDiscount} грн.
                  </p>
                </div>
              </div>
            </div>
            <div className="combo-products-controls">
              <p className="sales-name">{`АКЦІЯ ${parentProduct.Sales.sale_name.toUpperCase()}`}</p>
              <p className="product-card-light-text">{totalPairPrice} грн.</p>
              <div className="details-custom-controls">
                <div className="buttons-wrapper">
                  <button
                    className="custom-product-button decrease-button"
                    disabled={disableDecrease}
                    onClick={handleProductDecrease}
                  >
                    <MinusIcon />
                  </button>
                  <span className="custom-counter">{totalChildSelected}</span>
                  <button
                    disabled={disableIncrease}
                    className="custom-product-button increase-button"
                    onClick={handleProductIncrease}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="filled-text-button wide-button"
                onClick={modifierHandler}
              >
                Додати в корзину
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
