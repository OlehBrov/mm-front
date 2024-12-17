import React, { useEffect, useState } from "react";
import SlotCounter from "react-slot-counter";
import { CartLink } from "./CartLink";
import { useDispatch, useSelector } from "react-redux";
import { selectCartTotalSum } from "../redux/selectors/selectors";
import { Link } from "react-router-dom";
import { clearCart } from "../redux/features/cartSlice";

export const FooterCartSection = () => {
  const totalSum = useSelector(selectCartTotalSum);

  const dispatch = useDispatch();
  const clearCartHandler = (e) => {
    e.preventDefault();
    dispatch(clearCart());
  };

  return (
    <div className="footer-cart-wrapper">
      <div className="footer-cart-counter-wrap">
        <CartLink />
        <div className="total-text">
          <SlotCounter
            value={totalSum}
            sequentialAnimationMode={true}
            useMonospaceWidth={true}
            // containerClassName="counter-text"
          />{" "}
         <span >грн.</span> 
        </div>
      </div>
      <div className="footer-cart-links-wrapper">
        <Link
          to="#"
          onClick={clearCartHandler}
          className={`footer-cart-link footer-cancel-link  ${
            totalSum !== 0 ? "" : "link-disabled"
          }`}
        >
          Скасувати
        </Link>
        <Link
          to={"/cart"}
          className={`footer-cart-link footer-buy-link ${
            totalSum !== 0 ? "" : "link-disabled"
          }`}
        >
          Переглянути замовлення і оплатити
        </Link>
      </div>
    </div>
  );
};
