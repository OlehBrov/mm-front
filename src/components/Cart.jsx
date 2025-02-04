import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthorization,
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
import { PulseLoader, RiseLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { CartProductItem } from "./CartProductItem";
import Scrollbars from "react-custom-scrollbars-2";
import { setBuyStatus } from "../redux/features/buyStatus";
import { socket } from "../routes/root";

export const Cart = () => {
  const cart = useSelector(selectCart);

  const [cancelFunction, cancelData] = useCancelBuyProductsMutation();
  const buyStatus = useSelector(selectBuyStatus);
  const cartProducts = useSelector(selectCartProducts);
  const totalSum = useSelector(selectCartTotalSum);
  const [showPaymentWaiting, setShowPaymentWaiting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showTwoPaysInfo, setShowTwoPaysInfo] = useState(false);
  const [currentPaymentCount, setCurrentPaymentCount] = useState(1);
  // const [showPaymentError, setShowPaymentError] = useState(false);
useEffect(() => {
  socket.once("secondPayment", () => {
    console.log("secondPayment");
    setCurrentPaymentCount(2)
  });

  // Cleanup in case the component unmounts before the event triggers
  return () => {
    socket.off("secondPayment");
    setCurrentPaymentCount(1)
  };
}, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log("cartProducts", cartProducts);

  useEffect(() => {
    console.log('cart', cart)
    // if (
    //   parseFloat(cart.taxes.noVATTotalSum) > 0 &&
    //   parseFloat(cart.taxes.withVATTotalSum) > 0
    // ) {
    //   setShowTwoPaysInfo(true);
    //   console.log(
    //     "cart.taxes.noVATTotalSum ",
    //     parseFloat(cart.taxes.noVATTotalSum)
    //   );
    //   console.log(
    //     "cart.taxes.withVATTotalSum ",
    //     parseFloat(cart.taxes.withVATTotalSum)
    //   );
    // }
     
  }, [cart]);

  useEffect(() => {
    dispatch(setBuyStatus(""));
    setShowLoader(false);
  }, []);
  useEffect(() => {
    
    if (cancelData.isSuccess) setShowLoader(false);
  }, [cancelData]);
  useEffect(() => {
   
    if (buyStatus.status === "fetching" || buyStatus.status === "loading") {
      setShowPaymentWaiting(true);

      // setShowPaymentError(false);
    }
    if (buyStatus.status === "error") {
      setShowPaymentWaiting(false);
      // setShowPaymentError(true);
      navigate("/buy-error");
    }
    if (buyStatus.status === "success") navigate("/success");
  }, [buyStatus]);

  const cancelBuyButtonHandler = () => {
    cancelFunction();
    setShowLoader(true);
  };
  useEffect(() => {
    console.log("cartProducts", cartProducts);
  }, [cartProducts]);
  return (
    <div className="cart-container">
      {showPaymentWaiting && (
        <div className="payment-wait-container">
          <div className="empty-cart-notification-outer-wrapper">
            <div className="empty-cart-notification-wrapper">
              {cart.separatePayment && (
                <>
                  <p className="notification-light-text">
                    Буде проведено 2 оплати
                  </p>

                  {currentPaymentCount === 1 && (
                    <p className="notification-light-text">
                      Проведіть першу оплату в терміналі
                    </p>
                  )}

                  {currentPaymentCount === 2 && (
                    <p className="notification-light-text">
                      Проведіть другу оплату в терміналі
                    </p>
                  )}
                </>
              )}
              {!cart.separatePayment && (
                <p className="notification-light-text">
                  Для оплати скористайтесь терміналом
                </p>
              )}
              <div>
                <img src="img/icons/mobile.png" alt="" />
              </div>
              <button
                className="cancel-buy-button"
                onClick={cancelBuyButtonHandler}
                disabled={showLoader}
              >
                {showLoader ? <RiseLoader /> : "Відміна"}
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
