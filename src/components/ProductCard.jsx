import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/features/cartSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SaleDiscountMarker } from "./icons/SaleDiscountMarker";
import { DetailsIcon } from "./icons/DetailsIcon";
import moment from "moment";
import { addDetailedProduct } from "../redux/features/detailedProductSlice";
import {
  shouldShowMarker,
  calculateDiscount,
  calculateNewPrice,
  calculateDaysLeft,
} from "../helper/salesDiscountCounter";
import {
  selectCartProducts,
  selectCartTotalSum,
} from "../redux/selectors/selectors";
import { use } from "react";

const SALES = [1, 2, 3, 4, 6, 7, 8];
const DISCOUNT_SALES = [1, 2, 4];
const QUANTITY_SALES = [7, 8];
const MANUAL_SALES = [3, 6];

export const ProductCard = ({ product, useVATbyDefault, isSingleMerchant, onIdle }) => {
  const [productQtyAvailable, setProductQtyAvailable] = useState(1);
  const [showMarker, setShowMarker] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [newPrice, setNewPrice] = useState(null);
  const [priceDecrement, setPriceDecrement] = useState(0);
  const [hasLowerPrice, setHasLowerPrice] = useState(false);
  const [productAvailable, setProductAvailable] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [merchant, setMerchant] = useState(null);


  const cartTotal = useSelector(selectCartTotalSum);

  const prodsInCart = useSelector(selectCartProducts);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const regularPrice = parseFloat(product.product_price).toFixed(2);

  useEffect(() => {
    const inCartProduct = prodsInCart.find((prod) => prod.id === product.id);
    if (cartTotal === 0) {
      setProductQtyAvailable(Number(product.product_left));
      setProductAvailable(true);
    }
    if (inCartProduct) {
      const updatedQtyAvailable =
        Number(product.product_left) - Number(inCartProduct.inCartQuantity);
      setProductQtyAvailable(updatedQtyAvailable);

      if (updatedQtyAvailable <= 0) {
        setProductAvailable(false); // Mark product as unavailable if no more stock
      }
    } else {
      setProductQtyAvailable(Number(product.product_left));
    }
  }, [prodsInCart, product, cartTotal]);

  useEffect(() => {
    const markerShouldShow = shouldShowMarker(product);
    setShowMarker(markerShouldShow);

    if (!markerShouldShow) return;

    let discount = 0;
    if (product.sale_id === 1 || product.sale_id === 2) {
      const daysLeft = calculateDaysLeft(product);
      if (daysLeft <= 3) {
        discount = calculateDiscount(product, daysLeft);
        setDiscountValue(discount); // Show discount percentage
      }
    } else if ([3, 4, 6, 9].includes(product.sale_id)) {
      discount = calculateDiscount(product);
      setDiscountValue(discount); // Show discount percentage
    }
    setDiscountValue(discount);
    if (discount > 0) {
      const calculatedNewPrice = calculateNewPrice(product, discount);
      setNewPrice(calculatedNewPrice);
      setPriceDecrement((regularPrice - calculatedNewPrice).toFixed(2));
      setHasLowerPrice(true);
      setDiscountValue(discount);
    }
  }, [product]);

  useEffect(() => {
    if (!isSingleMerchant && !useVATbyDefault) {
      setMerchant("both");
    }
    if (isSingleMerchant && !useVATbyDefault) {
      setMerchant("nonVAT");
    }
    if (isSingleMerchant && useVATbyDefault) {
      setMerchant("VAT");
    }
  }, [useVATbyDefault, isSingleMerchant]);

  const handleProductClick = (e) => {
    e.preventDefault();
    if (productQtyAvailable > 0) {
      dispatch(
        addToCart({
          product: {
            ...product,
            inCartQuantity: 1,
            priceDecrement,
            priceAfterDiscount: newPrice,
            hasLowerPrice,
            merchant,
            discountValue
          },
          taxData: {
            useVATbyDefault,
            isSingleMerchant,
          },
        })
      );

      const updatedQtyAvailable = productQtyAvailable - 1;
      setProductQtyAvailable(updatedQtyAvailable);

      // Mark product as unavailable if no more stock
      setShowConfirm(true);
      setTimeout(() => {
        setShowConfirm(false);
      }, 700);
      if (updatedQtyAvailable <= 0) {
        setProductAvailable(false);
      }
    } else {
      console.log("No more stock available for this product.");
    }
  };

  const detailsClickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addDetailedProduct({
        ...product,
        inCartQuantity: 1,
        priceDecrement,
        priceAfterDiscount: newPrice,
        hasLowerPrice,
        merchant,
        discountValue,
        taxData: {
            useVATbyDefault,
            isSingleMerchant,
          },
      })
    );
    navigate("/productDetails", { state: { from: { location } } });
  };

  return (
    <Link
      to={"#"}
      className={`product-card ${productAvailable ? "" : "no-product"}`}
      onClick={(e) => handleProductClick(e, product)}
    >
      {showConfirm && (
        <div className="product-confirm-wrapper">
          <svg
            width="165px"
            height="165px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <circle
                cx="12"
                cy="12"
                r="8"
                fill="#FF6A14"
                fillOpacity="0.24"
              ></circle>{" "}
              <path
                d="M8.5 11L11.3939 13.8939C11.4525 13.9525 11.5475 13.9525 11.6061 13.8939L19.5 6"
                stroke="#FF6A14"
                strokeWidth="1.2"
              ></path>{" "}
            </g>
          </svg>
        </div>
      )}
      {showMarker && (
        <SaleDiscountMarker type={product.sale_id} value={discountValue} />
      )}
      <div className={`product-image-wrapper`}>
        <img className={`product-image`} src={product.product_image} alt="" />
      </div>
      <div className={`product-card-footer`}>
        <div className="product-card-text-wrapper">
          <p className="product-card-name">{product.product_name}</p>
          <p
            className={`product-card-light-text ${
              hasLowerPrice ? "crossed" : ""
            }`}
          >
            {regularPrice} грн.
          </p>
          {hasLowerPrice && (
            <p className="product-card-light-text">{newPrice} грн.</p>
          )}
        </div>
        {!onIdle &&  <button
          type="button"
          onClick={(e) => detailsClickHandler(e, product)}
          className="product-card-details-button"
        >
        <DetailsIcon />
        </button>}
      </div>
    </Link>
  );
};
