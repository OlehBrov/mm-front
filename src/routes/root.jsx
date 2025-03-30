import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../redux/store";
import { IdleTimerProvider, useIdleTimer } from "react-idle-timer";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  selectAuthorization,
  selectBuyStatus,
  selectCartProducts,
  selectCartTotalSum,
  selectFilter,
  selectNotify,
selectTerminalState,
} from "../redux/selectors/selectors";
import { addToCart, clearCart } from "../redux/features/cartSlice";
import { io } from "socket.io-client";
import {
  setNavigate,
  storeApi,
  useCancelBuyProductsMutation,
  useGetMerchantDataQuery,
  useGetSingleProductQuery,
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
import { clearBuyStatus, setPaymentCount } from "../redux/features/buyStatus.js";
import { AddProductConfirm } from "../components/AddProductConfirm.jsx";
import {
  setShowAddProductsConfirm,
  setShowConfirm,
} from "../redux/features/showAddConfirmSlice.js";
import {
  setIdleOpenChecking,
  setIsIdleOpen,
  setIsNotifyOpen,
  setNoProdError,
} from "../redux/features/notifySlice.js";
import { BuyError } from "../components/BuyError.jsx";

const auth_id = 998877;
// console.log("Connecting with store_id:", auth_id);
const events = [
  "mousemove",
  "keydown",
  "keypress",
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
});

export const Root = () => {
  const [pageHeading, setPageHeading] = useState("Каталог продуктів");
  const [idleEvent, setIdleEvent] = useState(events);

  const [searchBarcode, setSearchBarcode] = useState(null);

  const [merchant, setMerchant] = useState(null);
  const terminalStatus = useSelector(selectTerminalState);
  const cartProducts = useSelector(selectCartProducts);
  const currentFilter = useSelector(selectFilter);
  const buyStatus = useSelector(selectBuyStatus);
  const totalPrice = useSelector(selectCartTotalSum);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    isNotifyOpen,
    isIdleOpen,
    idleOpenChecking,
    timeout,
    promptBeforeIdle,
  } = useSelector(selectNotify);

  let barcode = "";



  const singleProduct = useGetSingleProductQuery(
    { barcode: searchBarcode },
    {
      skip: !searchBarcode,
      refetchOnMountOrArgChange: true,
    }
  );

  const [cancelFunction, cancelData] = useCancelBuyProductsMutation();
  useEffect(() => {
    console.log("singleProduct", singleProduct);
  }, [singleProduct]);
  const merchantData = useGetMerchantDataQuery();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
     console.log("merchantData", merchantData);
    if (merchantData.isSuccess) {
     console.log("merchantData", merchantData);
      dispatch(setMerchantsData(merchantData.data));
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
    console.log('root buyStatus', buyStatus)
    if (
      totalPrice === 0 ||
      buyStatus.status === "fetching" ||
      buyStatus.status === "loading"
    ) {
      setButtonDisabled(true);
    } else setButtonDisabled(false);
  }, [buyStatus, totalPrice]);

  useEffect(() => {
    const handleScreenStatus = () => {
      console.log("handleScreenStatus listener");
      // Emit current idle status
      socket.emit("idle-status", { isIdleOpen });

      if (!isIdleOpen) dispatch(setIdleOpenChecking(true));
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

  useEffect(() => {
    if (!merchantData.isSingleMerchant && !merchantData.useVATbyDefault) {
      setMerchant("both");
    }
    if (merchantData.isSingleMerchant && !merchantData.useVATbyDefault) {
      setMerchant("nonVAT");
    }
    if (merchantData.isSingleMerchant && merchantData.useVATbyDefault) {
      setMerchant("VAT");
    }
  }, [merchantData]);

  const handleKeyPress = (event) => {
    console.log("event", event);
    if (event.key === "Enter") {
      barCodeHandler(barcode);

      return;
    }
    if (event.type === "keypress" || event.type === "keydown") {
      barcode += event.key;
    }
  };

  useEffect(() => {
    // Attach keypress or keydown listener
    document.addEventListener("keypress", handleKeyPress);
    console.log("Attach keypress or keydown listener");
    // Clean up listener on unmount
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      console.log("Clean up listener on unmount");
    };
  }, []);


  const handleIdleClose = () => {
    console.log("handleIdleClose invoked");
    dispatch(setIsIdleOpen(false));
    setIdleEvent(events);
    dispatch(clearBuyStatus());
    navigate("/products");
  };


  const barCodeHandler = (code) => {
    if (isIdleOpen) {
      console.log("isIdleOpen in barCodeHandler", isIdleOpen);
      handleIdleClose();
    }
    const latestIsIdleOpen = store.getState().notify.isIdleOpen;
    const latestIsNotify = store.getState().notify.isNotifyOpen;
    if (latestIsNotify) dispatch(setIsNotifyOpen(false));
    if (latestIsIdleOpen) dispatch(setIsIdleOpen(false));

    setSearchBarcode(code);

    setIdleEvent(events);
    // setSkip(false);
    barcode = "";
  };

  useEffect(() => {
    if (singleProduct?.isFetching) return;
    if (singleProduct?.error) {
      dispatch(setNoProdError(true));

      setTimeout(() => {
        dispatch(setNoProdError(false));
        setSearchBarcode(null);
      }, 2000);
    }
    if (singleProduct?.isSuccess && singleProduct?.status === "fulfilled") {
      dispatch(
        setShowAddProductsConfirm({
          show: true,
          product: singleProduct.currentData.product,
        })
      );
      setTimeout(() => {
        dispatch(
          setShowAddProductsConfirm({
            show: false,
            product: null,
          })
        );
      }, 1000);
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
          product: {
            ...singleProduct.currentData.product,
            inCartQuantity: 1,
            priceDecrement,
            priceAfterDiscount: newPrice,
            hasLowerPrice,
            merchant,
            discountValue: discount,
          },
          taxData: {
            useVATbyDefault: merchantData.useVATbyDefault,
            isSingleMerchant: merchantData.isSingleMerchant,
          },
        })
      );
      setSearchBarcode(null);
    }

    // Reset searchBarcode for future scans
    // setSkip(true);
    setSearchBarcode(null);
  }, [singleProduct]);

  // const onIdle = () => {
  //   console.log("onIdle invoked");
  //   if (isNotifyOpen) {
  //     dispatch(setIsIdleOpen(true)); // Show IdleWindow after NotifyWindow times out
  //     dispatch(clearCart()); // Clear cart if going to Idle
  //     dispatch(setIsNotifyOpen(false));
  //   } else {
  //     dispatch(setIsIdleOpen(true));
  //   }
  //   setIdleEvent("keydown");
  // };
  // const onActive = () => {
  //   console.log("onActive invoked");
  //   dispatch(setIsNotifyOpen(false));
  //   dispatch(setIsIdleOpen(false));
  //   navigate("/products");
  //   setIdleEvent(events);
  // };
  const { getRemainingTime, start, reset, pause, resume } = useIdleTimer({
    
    timeout: timeout,
    promptBeforeIdle: promptBeforeIdle,
    events: idleEvent,
    onPresenceChange: (presence) => {
      console.log('presence', presence)
    },
    onPrompt: () => {
      console.log("🔔 onPrompt fired");

        dispatch(setIsNotifyOpen(true));
     
    },
    onIdle: () => {
      console.log("💤 onIdle triggered");
      dispatch(clearCart());
      dispatch(clearBuyStatus());
      dispatch(setIsNotifyOpen(false));
      dispatch(setIsIdleOpen(true));
      navigate("/products");
      pause(); // stop further timer activity
    },
    onActive: () => {
      console.log("🟢 onActive");
      dispatch(setIsIdleOpen(false));
      dispatch(setIsNotifyOpen(false));
      resume();
      navigate("/products");
    },
    debounce: 500, // optional but helps avoid rapid firing
  });
  const handleNewUser = () => {
    console.log("handleNewUser invoked");
    dispatch(clearCart());
    dispatch(setIsNotifyOpen(false));
    cancelFunction();
    navigate("/products");
    setIdleEvent(events);
  };

  const handlePreviousUser = () => {
    console.log("handlePreviousUser invoked");

    dispatch(setIsNotifyOpen(false));
    setIdleEvent(events);
  };


  const handeNotifyClose = () => {
    console.log("handeNotifyClose invoked");
    dispatch(setIsNotifyOpen(false));
    setIdleEvent(events);
  };
  const clearCartHandler = () => {
    dispatch(clearCart());
  };
  // const handleTimerEnd = useCallback(() => {
  //   console.log("onTimerEnd");
  //   dispatch(setIsNotifyOpen(false));
  //   cancelFunction();
  //   clearCartHandler();
  //   dispatch(setIsIdleOpen(true));
  // }, [cancelFunction, dispatch]);

  const handleTimerEnd = () => {
    console.log("handleTimerEnd onTimerEnd");
    dispatch(setIsNotifyOpen(false));
    cancelFunction();
    clearCartHandler();
    dispatch(setIsIdleOpen(true));
  }
  return (
    // <IdleTimerProvider
    //   timeout={timeout}
    //   promptBeforeIdle={promptBeforeIdle}
    //   onPrompt={onPrompt}
    //   onIdle={onIdle}
    //   onActive={onActive}
    //   events={idleEvent}
    // >
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
                buttonDisabled && "link-disabled"
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
        <NoProduct />
        <AddProductConfirm />
        <SearchResultsPopup />
        <IdleWindow onClose={handleIdleClose} />
        <NotifyWindow
          isOpen={isNotifyOpen}
          onClose={handeNotifyClose}
          onTimerEnd={handleTimerEnd}
          onNewUser={handleNewUser}
          onPreviousUser={handlePreviousUser}
          getRemainingTime={getRemainingTime}
          promptBeforeIdle={promptBeforeIdle}
          timeout={timeout}
        />
        {buyStatus.status === "error" && <BuyError/>}
        <Outlet />
      </div>
      <Footer
        timerReset={reset}
        timerPause={pause}
      />
    </div>
    // </IdleTimerProvider>
  );
};
