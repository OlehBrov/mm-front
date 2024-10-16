import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { selectFilter } from "../redux/selectors/selectors";
import { useGetAllProductsQuery } from "../api/storeApi";

export const IdleWindow = ({ isOpen, children, onClose }) => {
  const currentFilter = useSelector(selectFilter);
  const [onSaleProducts, setOnSaleProducts] = useState([]);
  // const { isLoading, isSuccess, isError, data, error } = useGetAllProductsQuery(
  //   {
  //     page: 1,
  //     size: 6,
  //     filter: currentFilter.category,
  //     subcategory: currentFilter.subcategory,
  //   }
  // );
  // useEffect(() => {
  //   if (isSuccess)
  //     setOnSaleProducts(
  //       data.products.filter((product) => {
  //         console.log("product", product);
  //         return product.sale_id === 1;
  //       })
  //     );
  // }, [isSuccess, data]);
  // useEffect(() => {
  //   console.log("onSaleProducts", onSaleProducts);
  // }, [onSaleProducts]);
  if (!isOpen) {
    return null; // Do not render anything if the modal is closed
  }

  // Use ReactDOM.createPortal to render children into a different DOM node
  return ReactDOM.createPortal(
    <div className="portal-overlay">
      <div className="portal-content">
        {/* {onSaleProducts.map((product, i) => {
          while (i < 2) {
            return (
              <div key={product.id}>
                <p>{product.product_name}</p>
              </div>
            );
          }
        })} */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.getElementById("portal-root") // Render into the modal-root DOM node
  );
};
