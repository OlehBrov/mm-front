import React, { useEffect, useState } from "react";
import SlotCounter from "react-slot-counter";
import { CartLink } from "./CartLink";
import { useDispatch, useSelector } from "react-redux";
import { selectCartTotalSum, selectNotify } from "../redux/selectors/selectors";
import { Link } from "react-router-dom";
import { clearCart } from "../redux/features/cartSlice";
import { setPromptBeforeIdle } from "../redux/features/notifySlice";

export const FooterCartSection = () => {
  const totalSum = useSelector(selectCartTotalSum);
const { promptBeforeIdle } = useSelector(selectNotify);
  const dispatch = useDispatch();
  const clearCartHandler = (e) => {
    e.preventDefault();
    dispatch(clearCart());
  };
  useEffect(() => {
    if (totalSum > 0 && promptBeforeIdle === 0) {
      dispatch(setPromptBeforeIdle(30000));
    } else if (totalSum === 0) {
      dispatch(setPromptBeforeIdle(0));
    }

  }, [dispatch, promptBeforeIdle, totalSum]);
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
