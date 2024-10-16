import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  selectAuthorization,
  selectCart,
  selectFilter,
  selectProducts,
  selectSearch,
} from "../redux/selectors/selectors";
import { addToCart, clearCart } from "../redux/features/cartSlice";
import { io } from "socket.io-client";
import { setNavigate, useSearchProductsQuery } from "../api/storeApi";
import { IdleWindow } from "../components/IdleWindow";
import { NotifyWindow } from "../components/NotifyWindow";
import { setSearch } from "../redux/features/searchSlice";
import { SearchInput } from "../components/SearchInput";
import { SearchResultsPopup } from "../components/SearchResultsPopup";
import { CartLink } from "../components/CartLink";
const auth_id = process.env.REACT_APP_STORE_LOGIN;
console.log("Connecting with store_id:", auth_id);

export const Root = () => {
  const [idleTimer, setIdleTimer] = useState(null);
  const [notifyTimer, setNotifyTimer] = useState(null);
  const [isOpenNotify, setIsOpenNotify] = useState(false);
  const [isOpenIdle, setIsOpenIdle] = useState(false);
  const [pageHeading, setPageHeading] = useState("Каталог продуктів");

  const localProducts = useSelector(selectProducts);
  const cartProducts = useSelector(selectCart);
  const currentFilter = useSelector(selectFilter
 );
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  let barcode = "";
  const idleTimeout = 300000;
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

useEffect(() => {
    console.log('currentFilter.category', currentFilter.category)
    if (currentFilter.category === 0) {
     
      setPageHeading("Каталог продуктів");
      // setPageSize(6);
      console.log("setIsSubcategoryVisible(false)");
    } else {
    
      setPageHeading(currentFilter.categoryName);
      // setPageSize(4);
      console.log("setIsSubcategoryVisible(false)");
    }
  }, [currentFilter.category]);

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

  // IdleWindow Handlers
  const openIdleWindow = () => {
    setIsOpenIdle(true);
    clearAllTimers();
  };
  const closeIdleWindow = () => {
    setIsOpenIdle(false);
    resetIdleTimer(); // Restart idleTimer after closing the IdleWindow
    navigate("/products"); // Navigate to products
  };

  // NotifyWindow Handlers
  const openNotifyWindow = () => {
    setIsOpenNotify(true);
    clearAllTimers();
  };
  const closeNotifyWindow = () => {
    setIsOpenNotify(false);
    resetNotifyTimer(); // Restart notifyTimer after closing the NotifyWindow
  };

  const handleNewUser = () => {
    dispatch(clearCart()); // Clear cart when new user is selected
    closeNotifyWindow();
    resetIdleTimer(); // Start idleTimer after cart is cleared
  };

  const handlePreviousUser = () => {
    closeNotifyWindow(); // Keep the cart and close NotifyWindow
    resetNotifyTimer(); // Restart notifyTimer
  };

  // Resets the idleTimer when cart is empty
  const resetIdleTimer = () => {
    if (isOpenIdle || cartProducts.length) return; // Don't set idleTimer if cart has products or idle window is open
    clearTimeout(idleTimer); // Clear previous idleTimer
    const newIdleTimer = setTimeout(() => {
      openIdleWindow(); // Open IdleWindow after 30 seconds of inactivity
    }, idleTimeout);
    setIdleTimer(newIdleTimer);
  };

  // Resets the notifyTimer when cart is not empty
  const resetNotifyTimer = () => {
    if (isOpenNotify || !cartProducts.length) return; // Don't set notifyTimer if notify window is open or cart is empty
    clearTimeout(notifyTimer); // Clear previous notifyTimer
    const newNotifyTimer = setTimeout(() => {
      openNotifyWindow(); // Open NotifyWindow after 30 seconds of inactivity
    }, idleTimeout);
    setNotifyTimer(newNotifyTimer);
  };

  // Clears both timers when necessary
  const clearAllTimers = () => {
    clearTimeout(idleTimer);
    clearTimeout(notifyTimer);
  };

  // User click handling (resets the appropriate timer based on cart state)
  const handleUserClick = () => {
    if (cartProducts.length) {
      resetNotifyTimer(); // If cart is not empty, reset notifyTimer
    } else {
      resetIdleTimer(); // If cart is empty, reset idleTimer
    }
  };
  const handleNotifyTimerEnd = () => {
    closeNotifyWindow(); // Close the NotifyWindow
    openIdleWindow(); // Show the IdleWindow when notifyTimer ends
  };
  // Effect to manage the timer based on cart state
  useEffect(() => {
    if (cartProducts.length) {
      clearTimeout(idleTimer); // Clear idleTimer when cart is not empty
      resetNotifyTimer(); // Start notifyTimer when cart is not empty
    } else {
      clearTimeout(notifyTimer); // Clear notifyTimer when cart is empty
      resetIdleTimer(); // Start idleTimer when cart is empty
    }
  }, [cartProducts]);

  return (
    <div onClick={handleUserClick} className="clicker">
      <header>
        <div className="header-wrapper">
          <p className={`logo ${isOpenNotify ? "centered" : ""}`}>
            <span className="highlight-logo">NEXT</span>RETAIL
          </p>
          <h1 className="page-heading">{pageHeading}</h1>
          {/* <>
            {" "}
            {!isOpenNotify && <SearchInput />}
            {!isOpenNotify && <CartLink />}
          </> */}
        </div>
      </header>
      <div className="container">
        <SearchResultsPopup />
        <IdleWindow isOpen={isOpenIdle} onClose={closeIdleWindow} />
        <NotifyWindow
          isOpen={isOpenNotify}
          onClose={closeNotifyWindow}
          onNewUser={handleNewUser}
          onPreviousUser={handlePreviousUser}
          onTimerEnd={handleNotifyTimerEnd}
        />
        <Outlet />
      </div>
      <footer>
        <div className="footer-contacts-grid">
          <div className="footer-grid-item">
            <p>Гаряча лінія</p>
            <p>0800 123 22 0</p>
          </div>
          <div className="footer-grid-item">
            <p>Технічна підтримка</p>
            <p>0800 123 22 0</p>
          </div>
          <div className="footer-grid-item">
            <p>Відділ продажів</p>
            <p>0800 123 22 0</p>
          </div>
          <div className="footer-grid-item">
            <p>Веб-сайт</p>
            <div className="qr-wrapper">
              <img src="/img/icons/qr.png" alt="" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
