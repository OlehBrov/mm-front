import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { clearCart } from "../redux/features/cartSlice";
import { useEffect } from "react";
import { setFilter } from "../redux/features/filterSlice";
import { selectFilter } from "../redux/selectors/selectors";

export const SuccessPurchasePage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { qrCode } = location.state || {};
  useEffect(() => {
    dispatch(clearCart());
    dispatch(
      setFilter({
        name: "all",
        category: 0,
        subcategory: 0,
        categoryName: "",
      })
    );
  }, []);

  return (
    <>
      <div>
        <h1>Thank you for your purchase</h1>
        <Link to={"/products"} className="cart-button">
          Go to Home Page
        </Link>
      </div>
      <div className="qr-wrapper">
        {qrCode ? (
          <div className="receipt-container">
            <h2>Your Fiscal Receipt</h2>
            <iframe
              src={qrCode}
              title="Fiscal Receipt"
              width="100%"
              height="100%"
              frameBorder="0"
            ></iframe>
          </div>
        ) : (
          <p>Sorry, the fiscal receipt is not available.</p>
        )}
      </div>
    </>
  );
};
