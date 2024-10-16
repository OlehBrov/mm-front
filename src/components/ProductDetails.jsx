import React from "react";
import { MinusIcon } from "./icons/MinusIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { CloseIcon } from "./icons/CloseIcon";

export const ProductDetails = (props) => {
  return (
    <div className="product-quntity-popup">
      <div className="details-card">
        <button
          className="details-close-button"
          type="button"
          onClick={() => props.setIsQtyModifierOpen(false)}
        >
          <CloseIcon />
        </button>
        <div className="details-grid">
          <div className="details-image-wrapper">
            <img src={props.selectedProduct.product_image} alt="" />
          </div>
          <div className="details-custom">
            <p className="details-product-name">
              {props.selectedProduct.product_name}
            </p>
            <div className="details-custom-controls">
              <p className="details-text details-price">
                {props.selectedProduct.product_price} грн.
              </p>
              <div className="buttons-wrapper">
                <button
                  className="custom-product-button decrease-button"
                  disabled={props.productQty < 2}
                  onClick={() =>
                    props.setProductQty((prev) => {
                      return prev - 1;
                    })
                  }
                >
                  <MinusIcon />
                </button>
                <span className="custom-counter">{props.productQty}</span>
                <button
                  className="custom-product-button increase-button"
                  onClick={() =>
                    props.setProductQty((prev) => {
                      return prev + 1;
                    })
                  }
                >
                  <PlusIcon />
                </button>
              </div>{" "}
              <p className="details-text details-cost">
                {(
                  props.productQty * props.selectedProduct.product_price
                ).toFixed(2)}{" "}
                грн.
              </p>
            </div>{" "}
            <button
              type="button"
              className="filled-text-button"
              onClick={props.modifierHandler}
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
                <p className="details-text description-text">
                  {props.selectedProduct.product_description
                    ? props.selectedProduct.product_description
                    : "Скоро тут буде розміщено опис товару"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
