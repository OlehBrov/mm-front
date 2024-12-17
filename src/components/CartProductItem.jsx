import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  decrementComboProductsCount,
  decrementProductsCount,
  incrementComboProductsCount,
  incrementProductsCount,
  removeComboFromCart,
  removeFromCart,
} from "../redux/features/cartSlice";
import { MinusIcon } from "./icons/MinusIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { BinIcon } from "./icons/BinIcon";

export const CartProductItem = ({ product }) => {
  const [hasLowerPrice, setHasLowerPrice] = useState(product.hasLowerPrice);
  const [currentProductPrice, setCurrentProductPrice] = useState(
    product.product_price
  );
  const [comboProduct, setComboProduct] = useState(null);
  const [comboPrice, setComboPrice] = useState(0);
  console.log('CartProductItem product.hasowerPrice', product.hasLowerPrice)
  useEffect(() => {
    setComboProduct(() => {
      return product?.productsChildProduct
        ? product.productsChildProduct
        : null;
    });
    if (product.productsChildProduct)
      setComboPrice(() => {
        const sum =
          Number(product.priceAfterDiscount) +
          Number(product.productsChildProduct.priceAfterDiscount);

        return sum.toFixed(2);
      });
  }, []);

  const dispatch = useDispatch();

  const deleteProduct = (id) => {
    dispatch(removeFromCart(id));
  };

  const regularPrice = parseFloat(product.product_price);
  const lowPrice = parseFloat(product.priceAfterDiscount);
  // useEffect(() => {
  //   setHasLowerPrice(
  //     product.priceAfterDiscount !== 0 &&
  //       product.priceAfterDiscount < product.product_price
  //   );
  // }, []);

  useEffect(() => {
    if (hasLowerPrice) {
      setCurrentProductPrice(lowPrice);
    }
    console.log('product', product)
    console.log('lowPrice', lowPrice)
    console.log('hasLowerPrice', hasLowerPrice)
  }, [hasLowerPrice, lowPrice]);

  const comboProductIncrement = (id) => {
    dispatch(incrementComboProductsCount(id));
  };
  const comboProductDecrement = (id) => {
    dispatch(decrementComboProductsCount(id));
  };
  const removeComboProductsFromCart = (id) => {
    dispatch(removeComboFromCart(id));
  };
  return (
    <div className="cart-list-item">
      {comboProduct && (
        <>
          <div className="cart-item-descr-wrapper">
            <div className="combo-cart-item-img-wrap">
              <div className="cart-item-img-wrap">
                <img
                  className="cart-product-item-img"
                  src={product.product_image}
                  alt=""
                />
              </div>
              <div className="cart-item-img-wrap">
                <img
                  className="cart-product-item-img"
                  src={product.product_image}
                  alt=""
                />
              </div>
            </div>

            <div className="cart-product-details">
              <div className="combo-cart-item-text-wrap">
                <div className="product-name-wrap">
                  <p className="cart-product-text cart-product-bold-text">
                    {product.product_name}
                  </p>

                  <p
                    className={`cart-product-text cart-product-light-text ${
                      hasLowerPrice ? "crossed" : ""
                    }`}
                  >
                    {regularPrice} грн.
                  </p>

                  {hasLowerPrice && (
                    <p className="product-card-light-text">
                      {product.priceAfterDiscount} грн.
                    </p>
                  )}
                </div>
                <div className="product-name-wrap">
                  <p className="cart-product-text cart-product-bold-text">
                    {comboProduct.product_name}
                  </p>

                  <p
                    className={`cart-product-text cart-product-light-text ${
                      hasLowerPrice ? "crossed" : ""
                    }`}
                  >
                    {comboProduct.product_price} грн.
                  </p>

                  {hasLowerPrice && (
                    <p className="product-card-light-text">
                      {comboProduct.priceAfterDiscount} грн.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="cart-item-controls">
            <div className="buttons-wrapper">
              <button
                className="custom-product-button decrease-button"
                disabled={product.inCartQuantity < 2}
                onClick={() => comboProductDecrement(product.id)}
              >
                <MinusIcon />
              </button>
              <span className="custom-counter">{product.inCartQuantity}</span>
              <button
                className="custom-product-button increase-button"
                onClick={() => comboProductIncrement(product.id)}
                disabled={
                  product.inCartQuantity >= parseInt(product.product_left)
                }
              >
                <PlusIcon />
              </button>
            </div>{" "}
          </div>
          <div className="cart-item-total">
            <p className="cart-product-text cart-product-light-text">
              {(comboPrice * product.inCartQuantity).toFixed(2)} грн.
            </p>
            <button
              type="button"
              onClick={() => removeComboProductsFromCart(product.id)}
              className="custom-product-button cart-item-delete-button"
            >
              <BinIcon />
            </button>
          </div>
        </>
      )}
      {!comboProduct && (
        <>
          <div className="cart-item-descr-wrapper">
            <div className="cart-item-img-wrap">
              <img
                className="cart-product-item-img"
                src={product.product_image}
                alt=""
              />
            </div>
            <div className="cart-product-details">
              <p className="cart-product-text cart-product-bold-text">
                {product.product_name}
              </p>

              <p
                className={`cart-product-text cart-product-light-text ${
                  hasLowerPrice ? "crossed" : ""
                }`}
              >
                {regularPrice} грн.
              </p>

              {hasLowerPrice && (
                <p className="product-card-light-text">{lowPrice} грн.</p>
              )}
            </div>
          </div>

          <div className="cart-item-controls">
            <div className="buttons-wrapper">
              <button
                className="custom-product-button decrease-button"
                disabled={product.inCartQuantity < 2}
                onClick={() => dispatch(decrementProductsCount(product.id))}
              >
                <MinusIcon />
              </button>
              <span className="custom-counter">{product.inCartQuantity}</span>
              <button
                className="custom-product-button increase-button"
                onClick={() => dispatch(incrementProductsCount(product.id))}
                disabled={
                  product.inCartQuantity >= parseInt(product.product_left)
                }
              >
                <PlusIcon />
              </button>
            </div>{" "}
          </div>
          <div className="cart-item-total">
            <p className="cart-product-text cart-product-light-text">
              {(currentProductPrice * product.inCartQuantity).toFixed(2)} грн.
            </p>
            <button
              type="button"
              onClick={() => deleteProduct(product.id)}
              className="custom-product-button cart-item-delete-button"
            >
              <BinIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
