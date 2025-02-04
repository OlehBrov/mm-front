import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../redux/store";
import { IdleTimerProvider, useIdleTimer } from "react-idle-timer";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  selectAuthorization,
  selectCartProducts,
  selectFilter,
  selectProducts,
  selectSearch,
  selectTerminalState,
} from "../redux/selectors/selectors";
import { addToCart, clearCart } from "../redux/features/cartSlice";
import { io } from "socket.io-client";
import {
  setNavigate,
  storeApi,
  useGetMerchantDataQuery,
  useGetSingleProductQuery,
  useSearchProductsQuery,
} from "../api/storeApi";
import { NoTerminalCover } from "../components/NoTerminalCover";
import { IdleWindow } from "../components/IdleWindow";
import { NotifyWindow } from "../components/NotifyWindow";
import { setSearch } from "../redux/features/searchSlice";
import { SearchInput } from "../components/SearchInput";
import { SearchResultsPopup } from "../components/SearchResultsPopup";
import { CartLink } from "../components/CartLink";
import { Footer } from "../components/Footer";
import {
  calculateDaysLeft,
  calculateDiscount,
  calculateNewPrice,
} from "../helper/salesDiscountCounter";
import { NoProduct } from "../components/NoProduct";
import { setTerminalState } from "../redux/features/terminalSlice";
import { setMerchantsData } from "../redux/features/merchantsSlice";
import { setPaymentCount } from "../redux/features/buyStatus.js";

const auth_id = 998877;
// console.log("Connecting with store_id:", auth_id);
const events = [
  "mousemove",
  "keydown",
  "wheel",
  "DOMMouseScroll",
  "mousewheel",
  "mousedown",
  "touchstart",
  "touchmove",
  "MSPointerDown",
  "MSPointerMove",
  "visibilitychange",
];

export const socket = io("ws://localhost:5005", {
  reconnectionDelayMax: 5000,
  auth: {
    auth_id,
  },
});
socket.on("connect", () => {
  console.log("socket connected");
  socket.emit("check-status");
});
socket.on("terminal-status", (data) => {
  console.log("Payment Terminal Status:", data.status);

  store.dispatch(setTerminalState(data.status));
});

socket.on("product-updated", () => {
  console.log("product-updated");
  store.dispatch(storeApi.util.invalidateTags(["Products"]));
});

socket.on("twoPurchases", () => {
  console.log("twoPurchases");
 
})

export const Root = () => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isIdleOpen, setIsIdleOpen] = useState(false);
  const [idleOpenChecking, setIdleOpenChecking] = useState(false);

  const [pageHeading, setPageHeading] = useState("Каталог продуктів");
  const [totalPrice, setTotalPrice] = useState(0);
  const [idleEvent, setIdleEvent] = useState(events);
  const [skip, setSkip] = useState(true);

  const [searchBarcode, setSearchBarcode] = useState("");
  const [showNoProdError, setNoProdError] = useState(false);

  const terminalStatus = useSelector(selectTerminalState);
  const localProducts = useSelector(selectProducts);
  const cartProducts = useSelector(selectCartProducts);
  const currentFilter = useSelector(selectFilter);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  let barcode = "";

  const idleTimeout = 120000;
  const notifyTimeout = 30000;
  const notifyProgressMax = (idleTimeout - notifyTimeout) / 1000;

  const singleProduct = useGetSingleProductQuery(
    { barcode: searchBarcode },
    {
      skip,
    }
  );

  const merchantData = useGetMerchantDataQuery();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  useEffect(() => {

    if (merchantData.isSuccess) {
      dispatch(setMerchantsData(merchantData.data))
    }
  }, [merchantData]);
  useEffect(() => {
    if (location.pathname === "/cart") {
      setPageHeading("Корзина");
    } else if (currentFilter.category === 0) {
      setPageHeading("Каталог продуктів");
    } else {
      setPageHeading(currentFilter.categoryName);
    }
  }, [currentFilter.category, location]);

  useEffect(() => {
    const handleScreenStatus = () => {
      console.log("screen-status received. Current isIdleOpen:", isIdleOpen);

      // Emit current idle status
      socket.emit("idle-status", { isIdleOpen });

      if (!isIdleOpen && !isIdleOpen) setIdleOpenChecking(true);
    };

    // Attach the listener
    socket.on("screen-status", handleScreenStatus);
    if (idleOpenChecking && isIdleOpen) {
      socket.emit("idle-status", { isIdleOpen });
      setIdleOpenChecking(false);
    }
    // Cleanup to avoid duplicate listeners
    return () => {
      socket.off("screen-status", handleScreenStatus);
    };
  }, [isIdleOpen]); // Add `isIdleOpen` as a dependency to ensure the correct value is emitted

  // useEffect(() => {
  //   // Emit `idle-status` whenever `isIdleOpen` changes
  //   console.log("isIdleOpen state changed:", isIdleOpen);
  //   if (idleOpenChecking) socket.emit("idle-status", { isIdleOpen });

  //   if (isIdleOpen) setIdleOpenChecking(false);
  // }, [isIdleOpen, idleOpenChecking]);

  // socket.on("screen-status", () => {
  //   console.log("screen-status received. Current isIdleOpen:", isIdleOpen);

  //   // This ensures the current value of `isIdleOpen` is emitted
  //   socket.emit("idle-status", { isIdleOpen });
  //   if (!isIdleOpen) setIdleOpenChecking(true);
  // });

  // const handleKeyPress = (event) => {
  //   console.log('handleKeyPress event', event)
  //   if (event.key === "Enter") {
  //     barCodeHandler(barcode);
  //     barcode = "";
  //     return;
  //   }
  //   if (event.type === "keypress") {
  //     barcode += event.key;
  //   }
  // };
  useEffect(() => {
    const handleKeyPress = (event) => {
      console.log("handleKeyPress event", event);
      if (event.key === "Enter") {
        barCodeHandler(barcode);
        barcode = "";
        return;
      }
      if (event.type === "keypress" || event.type === "keydown") {
        barcode += event.key;
      }
    };

    // Attach keypress or keydown listener
    document.addEventListener("keypress", handleKeyPress);

    // Clean up listener on unmount
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);
  useEffect(() => {
    if (cartProducts) {
      setTotalPrice(
        cartProducts?.reduce((acc, item) => {
          return acc + item.product_price * item.inCartQuantity;
        }, 0)
      );
    }
  }, [cartProducts]);
  const barCodeHandler = (code) => {
    setNoProdError(false);
    console.log("code", code);
    setSearchBarcode(code);

    // const foundProduct = await localProducts.find(
    //   (item) => item.product.barcode.toString() === code
    // );
    // if (!foundProduct) return console.log("No such product found");
    // console.log("foundProduct", foundProduct);
    // await dispatch(addToCart(foundProduct.product));
    // if (location !== "/cart") navigate("/cart");
    setIsIdleOpen(false);
    setIdleEvent(events);
  };

  // useEffect(() => {
  //   document.addEventListener("keypress", handleKeyPress);
  //   resetIdleTimer();
  //   return () => {
  //     document.removeEventListener("keypress", handleKeyPress);
  //     clearAllTimers();
  //   };
  // }, [localProducts]);

  // IdleWindow Handlers
  // const openIdleWindow = () => {
  //   setIsOpenIdle(true);
  //   clearAllTimers();
  // };
  // const closeIdleWindow = () => {
  //   setIsOpenIdle(false);
  //   resetIdleTimer(); // Restart idleTimer after closing the IdleWindow
  //   navigate("/products"); // Navigate to products
  // };

  // // NotifyWindow Handlers
  // const openNotifyWindow = () => {
  //   setIsOpenNotify(true);
  //   clearAllTimers();
  // };
  // const closeNotifyWindow = () => {
  //   setIsOpenNotify(false);
  //   resetNotifyTimer(); // Restart notifyTimer after closing the NotifyWindow
  // };

  // const handleNewUser = () => {
  //   dispatch(clearCart()); // Clear cart when new user is selected
  //   closeNotifyWindow();
  //   resetIdleTimer(); // Start idleTimer after cart is cleared
  // };

  // const handlePreviousUser = () => {
  //   closeNotifyWindow(); // Keep the cart and close NotifyWindow
  //   resetNotifyTimer(); // Restart notifyTimer
  // };

  // // Resets the idle timer when cart is empty
  // const resetIdleTimer = () => {
  //   console.log("invoked resetIdleTimer");
  //   clearTimeout(idleTimer);
  //   if (!isOpenIdle && !cartProducts.length) {
  //     const newIdleTimer = setTimeout(() => {
  //       openIdleWindow();
  //     }, idleTimeout);
  //     setIdleTimer(newIdleTimer);
  //   }
  // };
  // // Resets the notify timer when cart has products
  // const resetNotifyTimer = () => {
  //   clearTimeout(notifyTimer);
  //   if (!isOpenNotify && cartProducts.length) {
  //     const newNotifyTimer = setTimeout(() => {
  //       openNotifyWindow();
  //     }, idleTimeout);
  //     setNotifyTimer(newNotifyTimer);
  //   }
  // };

  // // Clears both timers when necessary
  // const clearAllTimers = () => {
  //   clearTimeout(idleTimer);
  //   clearTimeout(notifyTimer);
  // };

  // // User click handling (resets the appropriate timer based on cart state)
  // const handleUserClick = () => {
  //   console.log("handleUserClick");
  //   if (cartProducts.length) {
  //     console.log("resetNotifyTimer");
  //     resetNotifyTimer(); // If cart is not empty, reset notifyTimer
  //   } else {
  //     console.log("resetIdleTimer");
  //     resetIdleTimer(); // If cart is empty, reset idleTimer
  //   }
  // };
  // const handleNotifyTimerEnd = () => {
  //   closeNotifyWindow(); // Close the NotifyWindow
  //   openIdleWindow(); // Show the IdleWindow when notifyTimer ends
  // };

  // // Effect to manage the timer based on cart state
  // useEffect(() => {
  //   if (cartProducts.length) {
  //     clearTimeout(idleTimer); // Clear idleTimer when cart is not empty
  //     resetNotifyTimer(); // Start notifyTimer when cart is not empty
  //   } else {
  //     clearTimeout(notifyTimer); // Clear notifyTimer when cart is empty
  //     resetIdleTimer(); // Start idleTimer when cart is empty
  //   }
  // }, [cartProducts]);
  useEffect(() => {
    console.log("searchBarcode", searchBarcode);
    if (searchBarcode) {
      setSkip(false);
    }
  }, [searchBarcode]);
  useEffect(() => {
    console.log("singleProduct", singleProduct);
    if (singleProduct.isError) {
      console.log("singleProduct.error", singleProduct.error);
      setNoProdError(true);
      setTimeout(() => {
        setNoProdError(false);
      }, 200000);
    }
    if (singleProduct.isSuccess && singleProduct.status === "fulfilled") {
      let discount = 0;
      let priceDecrement = 0;
      let newPrice = 0;
      let hasLowerPrice = false;
      const regularPrice = parseFloat(
        singleProduct.currentData.product.product_price
      ).toFixed(2);

      if (
        singleProduct.currentData.product.sale_id === 1 ||
        singleProduct.currentData.product.sale_id === 2
      ) {
        const daysLeft = calculateDaysLeft(singleProduct.currentData.product);
        if (daysLeft <= 3) {
          discount = calculateDiscount(
            singleProduct.currentData.product,
            daysLeft
          );
        }
      } else if (
        [3, 4, 6].includes(singleProduct.currentData.product.sale_id)
      ) {
        discount = calculateDiscount(singleProduct.currentData.product);
      }

      if (discount > 0) {
        const calculatedNewPrice = calculateNewPrice(
          singleProduct.currentData.product,
          discount
        );

        priceDecrement = (regularPrice - calculatedNewPrice).toFixed(2);
      }
      dispatch(
        addToCart({
          ...singleProduct.currentData.product,
          inCartQuantity: 1,
          priceDecrement,
          priceAfterDiscount: newPrice,
          hasLowerPrice,
        })
      );
      setSearchBarcode("");
      setSkip(true);
    }
  }, [singleProduct]);
  const onPrompt = () => {
    if (cartProducts.length > 0) {
      setIsNotifyOpen(true);
    } else {
      setIsIdleOpen(true);
    }
    setIdleEvent("none");
  };
  const onIdle = () => {
    if (isNotifyOpen) {
      setIsIdleOpen(true); // Show IdleWindow after NotifyWindow times out
      dispatch(clearCart()); // Clear cart if going to Idle
      setIsNotifyOpen(false);
    } else {
      setIsIdleOpen(true);
    }
    setIdleEvent("none");
  };
  const onActive = () => {
    setIsNotifyOpen(false);
    setIsIdleOpen(false);
    navigate("/products");
    setIdleEvent(events);
  };

  const handleNewUser = () => {
    dispatch(clearCart());
    setIsNotifyOpen(false);
    navigate("/products");
    setIdleEvent(events);
  };

  const handlePreviousUser = () => {
    setIsNotifyOpen(false);
    setIdleEvent(events);
  };

  const handleIdleClose = () => {
    setIsIdleOpen(false);
    setIdleEvent(events);
    navigate("/products");
  };
  const handeNotifyClose = () => {
    setIsNotifyOpen(false);
    setIdleEvent(events);
  };
  const clearCartHandler = () => {
    dispatch(clearCart());
  };


  return (
    <IdleTimerProvider
      timeout={idleTimeout}
      promptBeforeIdle={notifyTimeout}
      onPrompt={onPrompt}
      onIdle={onIdle}
      onActive={onActive}
      events={idleEvent}
    >
      <div className="clicker">
        <header>
          <div className="header-wrapper">
            <Link to={"/"} className={`logo ${isIdleOpen ? "centered" : ""}`}>
              <span className="highlight-logo">NEXT</span>RETAIL
            </Link>
            {!isIdleOpen && <h1 className="page-heading">{pageHeading}</h1>}
            {!isNotifyOpen && location.pathname === "/cart" && (
              <Link
                onClick={clearCartHandler}
                className={`footer-cart-link on-header-cart-link footer-cancel-link ${
                  totalPrice !== 0 ? "" : "link-disabled"
                }`}
              >
                Скасувати
              </Link>
            )}
            {/* <>
              {" "}
              {!isOpenNotify && <SearchInput />}
              {!isOpenNotify && <CartLink />}
            </> */}
          </div>
        </header>
        <div className="container">
          {terminalStatus.status === "offline" && <NoTerminalCover />}
          <NoProduct showNoProdError={showNoProdError} />
          <SearchResultsPopup />
          <IdleWindow isOpen={isIdleOpen} onClose={handleIdleClose} />
          <NotifyWindow
            isOpen={isNotifyOpen}
            onClose={handeNotifyClose}
            onNewUser={handleNewUser}
            onPreviousUser={handlePreviousUser}
            onTimerEnd={() => setIsIdleOpen(true)}
            notifyProgressMax={notifyTimeout}
          />
          <Outlet />
        </div>
        <Footer />
      </div>
    </IdleTimerProvider>
  );
};
