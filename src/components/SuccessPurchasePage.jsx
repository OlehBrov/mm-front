import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearCart } from "../redux/features/cartSlice";
import { useEffect, useState } from "react";
import { setFilter } from "../redux/features/filterSlice";
import { selectFilter, selectReciept } from "../redux/selectors/selectors";
import { Reciept } from "./Reciept";
import { clearBuyStatus } from "../redux/features/buyStatus";

export const SuccessPurchasePage = () => {
  const [showCheck, setShowCheck] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recieptData = useSelector(selectReciept)

 
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

 dispatch(clearBuyStatus())
  
  }, []);
  const handleShowCheck = () => {
    setShowCheck(!showCheck);
  };
  useEffect(() => {
    console.log('recieptData', recieptData)
}, [recieptData])
  const handleGoToMain = () => {
   
    navigate('/products')
  }
  return (
    <div className="success-container">
      <div className="success-page-decor-circle">
        <div className="success-page-message-wrapper">
          <div className="success-content">
            <div className="success-icon-wrapper">
              <img src="img/icons/success.svg" alt="" />
            </div>
            <div className="success-text-wrapper">
              <p className="seccess-text">Дякуємо за покупку!</p>

              <p className="seccess-text">Смачного!</p>
            </div>
            <div className="vertical-buttons">
             {recieptData.status === "Receipt pending" ?<p>Відсутній звязок з ДПС</p> :<button onClick={handleShowCheck} className="filled-text-button">Показати чек</button>}
              <button onClick={handleGoToMain} className="filled-text-button">Повернутися на головну сторінку</button>
            </div>
          </div>
        </div>
        {/* <h1>Thank you for your purchase</h1>
        <Link to={"/products"} className="cart-button">
          Go to Home Page
        </Link> */}
      </div>
      {showCheck && <Reciept fiscalResponse={recieptData.fiscalResponse} />}
    </div>
  );
};
