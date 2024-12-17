import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBuyStatus,
  selectCart,
  selectCartProducts,
  selectCartTotalSum,
} from "../redux/selectors/selectors";
import { Link, useNavigate } from "react-router-dom";
import {
  useBuyProductsMutation,
  useCancelBuyProductsMutation,
} from "../api/storeApi";
import {
  decrementProductsCount,
  incrementProductsCount,
  removeFromCart,
} from "../redux/features/cartSlice";
import { RiseLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { CartProductItem } from "./CartProductItem";
import Scrollbars from "react-custom-scrollbars-2";
import { setBuyStatus } from "../redux/features/buyStatus";

export const Cart = () => {
  const cart = useSelector(selectCart);
  const [cancelFunction, cancelData] = useCancelBuyProductsMutation();
  const buyStatus = useSelector(selectBuyStatus);
  const cartProducts = useSelector(selectCartProducts);
  const totalSum = useSelector(selectCartTotalSum);
  const [showPaymentWaiting, setShowPaymentWaiting] = useState(false);
  // const [showPaymentError, setShowPaymentError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log("cartProducts", cartProducts);
  useEffect(() => {
    dispatch(setBuyStatus(""));
  }, []);

  useEffect(() => {
    if (buyStatus.status === "fetching" || buyStatus.status === "loading") {
      setShowPaymentWaiting(true);
      // setShowPaymentError(false);
    }
    if (buyStatus.status === "error") {
      setShowPaymentWaiting(false);
      // setShowPaymentError(true);
      navigate("/buy-error")
    }
    if (buyStatus.status === "success") navigate("/success");
  }, [buyStatus]);
  useEffect(() => {
    console.log('cartProducts', cartProducts)
  }, [cartProducts])
  return (
    <div className="cart-container">
      {showPaymentWaiting && (
        <div className="payment-wait-container">
          <div className="empty-cart-notification-outer-wrapper">
            <div className="empty-cart-notification-wrapper">
              <p className="notification-light-text">
                Для оплати скористайтесь терміналом
              </p>
              <div>
                <img src="img/icons/mobile.png" alt="" />
              </div>
              <button className="cancel-buy-button" onClick={cancelFunction}>
                Відміна
              </button>
            </div>
          </div>
        </div>
      )}

      {cartProducts.length > 0 ? (
        <div className="cartlist-wrapper">
          <div className="cartlist-head">
            <div className="cartlist-head-item">
              <p>Продукт</p>
            </div>
            <div className="cartlist-head-item">
              <p>Кількість</p>
            </div>
            <div className="cartlist-head-item">
              <p>Вартість</p>
            </div>
          </div>

          <div className="cart-list-scroll-wrapper">
            <Scrollbars
              renderTrackVertical={(props) => (
                <div {...props} className="track-vertical" />
              )}
              renderThumbVertical={(props) => (
                <div {...props} className="thumb-vertical" />
              )}
              style={{ width: "100%", height: "90%" }}
              thumbSize={190}
            >
              <div className="cart-list">
                {cartProducts.map((el) => {
                  if (el.isComboChild) {
                    return null;
                  }
                  return (
                    <CartProductItem
                      key={el.isComboParent ? "parent" + el.id : el.id}
                      product={el}
                    />
                  );
                })}
              </div>
            </Scrollbars>
            {/* <h3 className="total-text">Total items: {totalItems} </h3>
            <h3 className="total-text">
              Total price, UAH: {totalPrice.toFixed(2)}
            </h3> */}
          </div>
        </div>
      ) : (
        <div className="epmty-cart-wrapper">
          <div className="empty-cart-notification-outer-wrapper">
            <div className="empty-cart-notification-wrapper">
              <h1>Ой, товари відсутні</h1>
              <Link
                to={"/products"}
                className="footer-counter-btn footer-counter-outlined-btn"
              >
                Повернутися до покупок
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
