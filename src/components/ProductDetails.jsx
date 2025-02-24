import React, { useEffect, useState } from "react";
import parse from "html-react-parser";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementProductsCount,
  incrementProductsCount,
} from "../redux/features/cartSlice";
import {
  selectCartProducts,
  selectCartTotalSum,
  selectDetailedProduct,
  selectMainSelected,
  selectMaxAvailable,
  selectTotalRemain,
  selectTotalSelected,
} from "../redux/selectors/selectors";
import {
  decrementMainSelected,
  decrementTotalSelected,
  incrementMainSelected,
  incrementTotalSelected,
  resetTotalSelected,
  setMainSelected,
  setMaxAvailable,
  setTotalSelected,
} from "../redux/features/selectedQuantitySlice";
import { ComboProduct } from "./ComboProduct";
import { MinusIcon } from "./icons/MinusIcon";
import { PlusIcon } from "./icons/PlusIcon";

export const ProductDetails = ({ taxData }) => {
  const detailedProduct = useSelector(selectDetailedProduct);
  const cartTotal = useSelector(selectCartTotalSum);
  const prodsInCart = useSelector(selectCartProducts);
  const maxAvailable = useSelector(selectMaxAvailable);
  const totalSelected = useSelector(selectTotalSelected);
  const totalRemain = useSelector(selectTotalRemain);
  const mainProductSelected = useSelector(selectMainSelected);

  const [productQtyAvailable, setProductQtyAvailable] = useState(1);
  const [productAvailable, setProductAvailable] = useState(true);

  const [disableIncrease, setDisableIncrease] = useState(false);
  const [disableDecrease, setDisableDecrease] = useState(true);
  const [isCombo, setIsCombo] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { hasLowerPrice, merchant } = detailedProduct;
  useEffect(() => {
    if (detailedProduct.sale_id === 7) {
      const childQuantity =
        detailedProduct.ComboProducts_Products_combo_idToComboProducts
          .Products_ComboProducts_child_product_idToProducts.product_left;
      if (Number(childQuantity) === 0 || isNaN(Number(childQuantity))) {
        return setIsCombo(false);
      }
      return setIsCombo(true);
    }
  }, [detailedProduct]);
  // Setting max available products
  useEffect(() => {
    dispatch(setMaxAvailable(Number(detailedProduct.product_left)));
    setDisableIncrease(totalSelected >= maxAvailable);
    setDisableDecrease(totalSelected < 1);
  }, [totalSelected, detailedProduct, totalRemain]);

  useEffect(() => {
    const inCartProduct = prodsInCart.find(
      (prod) => prod.id === detailedProduct.id
    );
    console.log("inCartProduct", inCartProduct);
    if (inCartProduct) {
      dispatch(setMainSelected(inCartProduct.inCartQuantity));
      const updatedQtyAvailable =
        Number(detailedProduct.product_left) - inCartProduct.inCartQuantity;

      setProductQtyAvailable(updatedQtyAvailable);
      setDisableIncrease(updatedQtyAvailable <= 0);
    } else {
      setProductQtyAvailable(Number(detailedProduct.product_left));
    }

    setProductAvailable(productQtyAvailable > 0);
  }, [prodsInCart, detailedProduct]);

  const handleProductIncrease = () => {
    if (totalSelected < maxAvailable) {
      dispatch(incrementMainSelected(1));
    }
  };

  const handleProductDecrease = () => {
    if (mainProductSelected >= 1) {
      dispatch(decrementMainSelected(1));
    }
  };

  const modifierHandler = () => {
    console.log("modifierHandler detailedProduct", detailedProduct);
    const { taxData, ...rest } = detailedProduct;
    console.log("rest", rest);

    dispatch(
      addToCart({
        product: {
          ...rest,
          inCartQuantity: mainProductSelected,
        },
        taxData,
      })
    );
    // dispatch(
    //   addToCart({ ...detailedProduct, inCartQuantity: mainProductSelected })
    // );
    dispatch(resetTotalSelected());
    navigate(state.from.location);
  };
  const handleBackLink = (e) => {
    e.preventDefault();
    navigate(state.from.location);
    dispatch(resetTotalSelected());
  };
  return (
    <div className="details-page-wrapper">
      <div className="circle-800" />
      <div className="circle-800 circle-635" />
      <div className="circle-600" />
      <div className="circle-600 circle-400" />

      <div className="details-card">
        <Link to="#" className="filled-text-button details-close-button" onClick={handleBackLink}>
          <img src="/img/icons/close.svg" alt="" />
        </Link>
        <div className="details-grid">
          <div className="details-image-wrapper">
            <img src={detailedProduct.product_image} alt="" />
          </div>
          <div className="details-custom">
            <div className="product-details-name-wrapper">
              <p className="details-product-name">
                {detailedProduct.product_name}
              </p>
              <div className="details-product-prices-wrapper">
                <p
                  className={`details-text details-price ${
                    hasLowerPrice && "crossed"
                  }`}
                >
                  {detailedProduct.product_price} грн.
                </p>
                {hasLowerPrice && (
                  <p className="details-text details-price">
                    {detailedProduct.priceAfterDiscount} грн.
                  </p>
                )}
              </div>
            </div>
            <div className="details-custom-controls">
              <div className="buttons-wrapper">
                <button
                  className="custom-product-button decrease-button"
                  disabled={disableDecrease}
                  onClick={handleProductDecrease}
                >
                  <MinusIcon />
                </button>
                <span className="custom-counter">{mainProductSelected}</span>
                <button
                  className="custom-product-button increase-button"
                  disabled={disableIncrease}
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
              disabled={disableDecrease}
            >
              Додати в корзину
            </button>
          </div>
          <div className="details-footer">
            <div className="details-description">
              <div className="description-selector">
                <p className="details-text">Опис</p>
              </div>
              <div className="description-text-wrap">
                {detailedProduct.product_description ? (
                  parse(detailedProduct.product_description)
                ) : (
                  <p className="details-text description-text">
                    Скоро тут буде розміщено опис товару
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isCombo && (
        <ComboProduct
          parentProduct={detailedProduct}
          productQtyAvailable={productQtyAvailable}
          setProductQtyAvailable={setProductQtyAvailable}
          merchant={merchant}
          state={state}
        />
      )}
    </div>
  );
};
