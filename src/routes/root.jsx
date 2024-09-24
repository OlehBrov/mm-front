import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  selectAuthorization,
  selectProducts,
} from "../redux/selectors/selectors";
import { addToCart } from "../redux/features/cartSlice";
import { io } from "socket.io-client";
import { setNavigate } from "../api/storeApi";
const auth_id = process.env.REACT_APP_STORE_LOGIN;
console.log("Connecting with store_id:", auth_id);




export const Root = () => {
  const localProducts = useSelector(selectProducts);
  const storeData = useSelector(selectAuthorization);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  let barcode = "";

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      barCodeHandler(barcode);
      barcode = "";
      return;
    }
    if (event.type === "keypress") {
      barcode += event.key;
    }
  };

  const barCodeHandler = async (code) => {
    const foundProduct = await localProducts.find(
      (item) => item.product.barcode.toString() === code
    );
    if (!foundProduct) return console.log("No such product found");
    console.log("foundProduct", foundProduct);
    await dispatch(addToCart(foundProduct.product));
    if (location !== "/cart") navigate("/cart");
  };
  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [localProducts]);
  // useEffect(() => {
  //   console.log("storeData", storeData);
  // }, [storeData]);
  return (
    <>
      <header>
        <div className="container">
          <div className="header-wrapper">
            <h1 className="header-heading">MicroMarket welcomes you</h1>
          </div>
        </div>
      </header>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};
