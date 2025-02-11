import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../redux/store";
import { IdleTimerProvider, useIdleTimer } from "react-idle-timer";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  selectAuthorization,
  selectBuyStatus,
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
});

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
  const buyStatus = useSelector(selectBuyStatus);

  const [buttonDisabled, setButtonDisabled] = useState(false);
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

  useEffect(() => {
    const handleKeyPress = (event) => {
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

  useEffect(() => {
    if (searchBarcode) {
      setSkip(false);
    }
  }, [searchBarcode]);
  useEffect(() => {
    if (singleProduct.isError) {
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
