import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBuyStatus,
  selectFilter,
  selectNotify,
} from "../redux/selectors/selectors";
import {
  useCancelBuyProductsMutation,
  useGetAllProductsQuery,
  useGetStoreSaleProductsQuery,
} from "../api/storeApi";
import { ProductCard } from "./ProductCard";
import QRCode from "react-qr-code";
import { clearBuyStatus } from "../redux/features/buyStatus";
import { clearCart } from "../redux/features/cartSlice";

export const IdleWindow = ({ onClose }) => {
  const { isIdleOpen } = useSelector(selectNotify);
  const { isLoading, isSuccess, isError, data, error } =
    useGetStoreSaleProductsQuery();
  
    const [cancelFunction, cancelData] = useCancelBuyProductsMutation();
  const buyStatus = useSelector(selectBuyStatus);
const dispatch = useDispatch()


  useEffect(() => {
    console.log("IdleWindow isIdleOpen", isIdleOpen);
  }, [isIdleOpen]);
  useEffect(() => {
    console.log("IdleWindow data", data);
  }, [data]);
  useEffect(() => {
    console.log("buyStatus in IdleWindow", buyStatus);
    if (buyStatus === "loading") {
      console.log("cancelFunction in IdleWindow");
      cancelFunction();
    }
  }, [buyStatus]);

  useEffect(() => {
    if (isIdleOpen) {
      dispatch(clearBuyStatus());
      dispatch(clearCart());
    }
  }, [isIdleOpen]);
  if (!isIdleOpen) {
    return null; // Do not render anything if the modal is closed
  }
  const handleCloseButton = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  };

  // Use ReactDOM.createPortal to render children into a different DOM node
  if (isSuccess)
    return ReactDOM.createPortal(
      <div className="portal-overlay">
        <div className="red-decor">
          <div className="idle-circle idle-circle-1" />
          <div className="idle-circle idle-circle-2" />
          <div className="idle-circle idle-circle-3" />
          <div className="light-shadow" />
        </div>
        <div
          className={`portal-content ${
            !data.products.length ? "no-slider" : ""
          }`}
        >
          {!data.products.length && ( // shoud be  !data.products.length
            <div className="no-sale-idle-logo-wrapper">
              <p className="screen-saver-logo">
                <span className="highlight-logo">NEXT</span>RETAIL
              </p>
            </div>
          )}
          {data.products.length > 0 && ( // shoud be data.products.length
            <>
              <div className="idle-sale-marker-wrapper">
                <p className="idle-sale-marker-text">Акція дня</p>
              </div>
              <div className="idle-sale-heading-wrapper">
                <p className="idle-sale-heading">Цінопад</p>
                <p className="idle-sale-subheading">
                  {data.store_sale_title} {data.discount * 100}%
                </p>
              </div>
              <div className="portal-cards-grid">
                <Swiper
                  modules={[Autoplay]}
                  onSwiper={(swiper) => console.log(swiper)}
                  spaceBetween={50}
                  slidesPerView={2}
                  loop={true}
                  autoplay={{
                    delay: 10000,
                    disableOnInteraction: true,
                  }}
                >
                  {data.products.map((product) => (
                    <SwiperSlide key={product.id}>
                      {" "}
                      <ProductCard product={product} onIdle={true} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>{" "}
            </>
          )}
          <div className="idle-sale-button-wrapper">
            <button
              className="idle-close-button"
              onClick={(e) => handleCloseButton(e)}
            >
              Дивіться, що є!
            </button>
          </div>
        </div>
        <div className="portal-idle-footer">
          <div className="portal-idle-footer-text-wrapper">
            <p className="portal-idle-footer-heading">
              Цікавлять комплексні рішення для Вашої компанії?
            </p>
            <p className="portal-idle-footer-text">
              Ми пропонуємо широкий спектр послуг від встановлення
              мікромаркетів, вендингових апаратів, кавомашин, пуріфаєрів до їх
              обслуговування
            </p>
          </div>

          <div className="portal-idle-link-wrapper">
            <div className="portal-idle-link-txt-wrapper">
              Дізнатись більше можна тут
            </div>
            <div className="portal-idle-link-code-wrapper">
              <div className="qr-link-wrap">
                <QRCode
                  size={180}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={"https://nextretail.com.ua"}
                  viewBox={`0 0 180 180`}
                />
              </div>
              <p>www.nextretail.com.ua</p>
            </div>
          </div>
        </div>
      </div>,
      document.getElementById("portal-root") // Render into the modal-root DOM node
    );
};
