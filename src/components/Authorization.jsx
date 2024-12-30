import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginStoreMutation } from "../api/storeApi";
import { logInStore } from "../redux/features/authSlice";
import { RiseLoader } from "react-spinners";
import { setStoreCartTaxConfig } from "../redux/features/cartSlice";

const { REACT_APP_STORE_LOGIN, REACT_APP_STORE_PASSWORD } = process.env;

export const Authorization = () => {
  const [loginStore, { isSuccess, isError, error }] = useLoginStoreMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    authSubmit();
  }, []);
  // Handle form submission
  const authSubmit = async () => {
    try {
      // Log form values

      // Perform login
      const result = await loginStore({
        login: REACT_APP_STORE_LOGIN,
        password: REACT_APP_STORE_PASSWORD,
      }).unwrap();

      await dispatch(logInStore(result));
      await dispatch(setStoreCartTaxConfig(result.single_merchant, result.use_VAT_by_default));
      console.log("result", result);
      if (result) {
        await window.electron.ipcRenderer.invoke("set-token", result.token);
        await window.electron.ipcRenderer.invoke(
          "set-refresh-token",
          result.refreshToken
        );
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Navigate on successful login
  useEffect(() => {
    if (isSuccess) {
      navigate("/products");
    } else if (isError) {
      console.error("Login failed with error:", error);
    }
  }, [isSuccess, isError, error, navigate]);

  return (
    <div className="container">
      <div className="auth-form-wrapper">
        {/* <form onSubmit={authSubmit}>
          <label htmlFor="login">
            Enter login:
            <input
              type="text"
              name="login"
              placeholder="Enter login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </label>
          <label htmlFor="password">
            Enter password:
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="auth-btn" type="submit">
            Login
          </button>
        </form> */}
        <RiseLoader />
      </div>
    </div>
  );
};
