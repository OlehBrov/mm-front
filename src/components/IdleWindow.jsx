import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import { selectFilter } from "../redux/selectors/selectors";
import {
  useGetAllProductsQuery,
  useGetStoreSaleProductsQuery,
} from "../api/storeApi";
import { ProductCard } from "./ProductCard";
import QRCode from "react-qr-code";

export const IdleWindow = ({ isOpen, onClose }) => {
  const currentFilter = useSelector(selectFilter);
  const [onSaleProducts, setOnSaleProducts] = useState([]);
  const { isLoading, isSuccess, isError, data, error } =
    useGetStoreSaleProductsQuery();
  useEffect(() => {
    console.log("data.products.lenght", data?.products.lenght);
    console.log("data.products", data?.products);
  }, [data]);
  if (!isOpen) {
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
        <div className="portal-content">
          {!data.products.length && (
            <div className="no-sale-idle-logo-wrapper">
<img src="img/NEXT-RETAIL-LOGO.png" alt="" />
            </div>
          )}
          {data.products.length > 0 && (
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
                      <ProductCard product={product} onIdle={true}/>
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
              До магазину
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
              мікромаркетів, вендингових апаратів та кавомашин до їх
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
