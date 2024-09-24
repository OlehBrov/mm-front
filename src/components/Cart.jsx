import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCart } from "../redux/selectors/selectors";
import { Link, useNavigate } from "react-router-dom";
import {
  useBuyProductsMutation,
  useCancelBuyProductsMutation,
} from "../api/storeApi";
import {
  decrementProductsCount,
  incrementProductsCount,
  removeFromCart,
} from "../redux/features/cartSlice";
import { RiseLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

export const Cart = () => {
  const cartProducts = useSelector(selectCart);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalItems = cartProducts.length;
  useEffect(() => {
    if (cartProducts) {
      setTotalPrice(
        cartProducts?.reduce((acc, item) => {
          return acc + item.Products.price * item.total;
        }, 0)
      );
    }
  }, [cartProducts]);

  const [buyFunction, buyingData] = useBuyProductsMutation();
  const [cancelFunction, cancelData] = useCancelBuyProductsMutation();
  const deleteProduct = (id) => {
    dispatch(removeFromCart(id));
  };
  useEffect(() => {
    console.log("cancelData", cancelData);
    console.log("buyingData", buyingData);
    buyingData.isSuccess && navigate("/success");
    buyingData.isError && toast.error("Помилка оплати");
  }, [buyingData, cancelData]);

  const handleBuy = async (prods) => {
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss:SSSS");
    const withDateProds = prods.map((p) => {
      return { ...p, dateTime };
    });

    try {
      const result = await buyFunction(withDateProds).unwrap(); // Unwrap to handle success or error
      console.log("Purchase result:", result);
      // Handle success
      navigate("/success");
    } catch (error) {
      console.error("Purchase failed:", error);
      // Handle error based on the rejected reason
      if (error.data?.errorDescription) {
        toast.error(error.data.errorDescription);
      } else {
        toast.error("Failed to process the purchase");
      }
    }
  };

  return (
    <div className="container cart-container">
      <h1>Cart</h1>
      {buyingData.isLoading && (
        <div className="spinner-container">
          <RiseLoader color="#36d7b7" loading size={30} />
          <p>Проведіть оплату покупки у сумі {totalPrice.toFixed(2)}</p>
          <button onClick={cancelFunction}>Відміна</button>
        </div>
      )}
      <ToastContainer />
      {!cartProducts.length && <h2>Cart is empty</h2>}
      <Link to={"/products"} className="cart-button">
        Back to Products
      </Link>
      {cartProducts.length && (
        <Link onClick={() => handleBuy(cartProducts)}>Buy products</Link>
      )}
      {cartProducts.length && (
        <>
          <ul className="cart-list">
            {cartProducts.map((el) => (
              <li key={el.product_id}>
                <div className="cart-product-item">
                  <img
                    className="cart-product-item-img"
                    src={el.Products.image}
                    alt=""
                  />
                  <div className="cart-product-details">
                    <p className="cart-product-item-name">
                      Name: {el.Products.product_name}
                    </p>
                    <p className="cart-product-item-text">
                      Quantity: {el.total}
                    </p>
                    <p className="cart-product-item-text">
                      Price: {el.Products.price}
                    </p>
                  </div>
                  <div className="cart-product-controls">
                    <div className="counter-wrapper">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(decrementProductsCount(el.product_id))
                        }
                      >
                        Less
                      </button>
                      <span>{el.total}</span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(incrementProductsCount(el.product_id))
                        }
                      >
                        More
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteProduct(el.product_id)}
                    >
                      Delete product
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="total-text">Total items: {totalItems} </h3>
          <h3 className="total-text">
            Total price, UAH: {totalPrice.toFixed(2)}
          </h3>
        </>
      )}
    </div>
  );
};
