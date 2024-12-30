import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthorization,
  selectCart,
  selectCartProducts,
  selectCartTotalSum,
  selectTaxes,
  selectVATSum,
} from "../redux/selectors/selectors";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  useBuyProductsMutation,
  useCancelBuyProductsMutation,
} from "../api/storeApi";
import { toast } from "react-toastify";
import { setReciept } from "../redux/features/recieptSlice";
import { setBuyStatus } from "../redux/features/buyStatus";
import { use } from "react";
import { store } from "../redux/store";

export const FooterCartCountSection = () => {
  const [buyFunction, buyingData] = useBuyProductsMutation();
const storeData = useSelector(selectAuthorization)
  const cart = useSelector(selectCart);
  const cartProducts = useSelector(selectCartProducts);
  const totalSum = useSelector(selectCartTotalSum);
  const taxesValues = useSelector(selectTaxes);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (buyingData.isFetching)
      dispatch(setBuyStatus({ status: "fetching", message: "" }));
    if (buyingData.isLoading)
      dispatch(setBuyStatus({ status: "loading", message: "" }));
    if (buyingData.isError)
      dispatch(
        setBuyStatus({
          status: "error",
          message: buyingData.error.data.errorDescription,
        })
      );
    if (buyingData.isSuccess)
      dispatch(setBuyStatus({ status: "success", message: "" }));
  }, [buyingData]);

  const handleBuy = async (prods) => {
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss:SSSS");
    const withDateProds = prods.cartProducts.map((p) => {
      return { ...p, dateTime };
    });

    const modifiedCart = {
      ...prods, // Keep the rest of the cartSlice object (e.g., cartTotalSum)
      cartProducts: withDateProds, // Replace cartProducts with the modified array
      storeId: storeData.store_id,
    };
    console.log('modifiedCart', modifiedCart)
    try {
      const result = await buyFunction(modifiedCart).unwrap(); // Unwrap to handle success or error
      if (result) dispatch(setReciept(result));
      console.log("buyFunction result", result);
    } catch (error) {
      if (error.data?.errorDescription) {
        console.log("ERROR", error.data.errorDescription);
      } else {
        console.log("An unexpected error occurred during purchase.");
      }
    }
  };

  return (
    <div className="footer-cart-count-wrapper">
      <div />
      <div className="counter-wrap">
        <p>
          Загальна вартість покупки: <span>{totalSum} грн.</span>
        </p>
       {taxesValues.VATSum !== 0 && <p>
          в тому числі ПДВ: <span>{taxesValues.VATSum} грн.</span>
        </p>}
      </div>
      <div className="footer-counter-btn-wrap footer-counter-back-btn-wrap">
        <Link
          to={"/products"}
          className="footer-counter-btn footer-counter-outlined-btn"
        >
          Повернутися до покупок
        </Link>
      </div>
      <div className="footer-counter-btn-wrap footer-counter-buy-btn-wrap">
        {" "}
        <Link
          onClick={() => handleBuy(cart)}
          className={`footer-counter-btn footer-counter-filled-btn ${
            cartProducts.length ? "" : "disabled-btn"
          }`}
        >
          Завершити покупку і оплатити
        </Link>
      </div>
    </div>
  );
};
