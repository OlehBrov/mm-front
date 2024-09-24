import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginStoreMutation } from "../api/storeApi";
import { logInStore } from "../redux/features/authSlice";
import { RiseLoader } from "react-spinners";


const { REACT_APP_STORE_LOGIN, REACT_APP_STORE_PASSWORD } = process.env;

export const Authorization = () => {
  const [loginStore, { isSuccess, isError, error }] = useLoginStoreMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('Authorization')
    console.log("window.electron in React component: homedir", window.electron);
  }, []);

  // const [login, setLogin] = useState("");
  // const [password, setPassword] = useState("");
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

      // Clear form fields
      // setLogin("");
      // setPassword("");

      // Dispatch login action
      console.log("loginStore result", result);
      // window.electron.store.set("token", result.token);
      // window.electron.store.set("refreshToken", result.refreshToken);

      await dispatch(logInStore(result));

      if (result) {
        console.log('result', result)
        await window.electron.ipcRenderer.invoke("set-token", result.token)
        await window.electron.ipcRenderer.invoke("set-refresh-token", result.refreshToken)
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Navigate on successful login
  useEffect(() => {
    if (isSuccess) {
      console.log("Navigation triggered due to successful login");
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
