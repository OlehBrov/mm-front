import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSearch } from "../redux/selectors/selectors";
import {
  addToCart,
  decrementProductsCount,
  incrementProductsCount,
} from "../redux/features/cartSlice";
import { clearSearchResults, setSearch } from "../redux/features/searchSlice";
import { Link, useNavigate } from "react-router-dom";
import { ButtonCartIcon } from "./icons/ButtonCartIcon";

export const SearchResultsPopup = () => {
  const [isOpenResults, setIsOpenResult] = useState(true);
  const [productQty, setProductQty] = useState(1);
  const { searchResults } = useSelector(selectSearch);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (searchResults.length > 0) {
      setIsOpenResult(true);
    } else setIsOpenResult(false);
  }, [searchResults]);

  const toCartHandler = (productToBuy) => {
    dispatch(addToCart(productToBuy));
  };

  const allResultsClickHandler = () => {
    // dispatch(setSearch(""));
    setIsOpenResult(false);
    navigate("/results");
  };

  const closeHandler = () => {
    dispatch(setSearch(""));
    setIsOpenResult(false);
  };
  return (
    <>
      {isOpenResults && (
        <div className="search-popup-wrapper">
          <div className="search-list-container">
            <ul className="search-list">
              {searchResults.map((prod) => {
                return (
                  <li key={prod.id} className="search-list-item">
                    <div className="search-list-item-img">
                      <img src={prod.product_image} alt="" />
                    </div>
                    <div className="search-list-product-data">
                      <p className="search-list-product-text search-list-product-name">
                        {prod.product_name}
                      </p>
                      <p className="search-list-product-text search-list-product-price">
                        {prod.product_price} грн.
                      </p>
                    </div>

                    {/* <div className="counter-wrapper">
                    <button
                      disabled={productQty < 2}
                      onClick={() =>
                        setProductQty((prev) => {
                          return prev - 1;
                        })
                      }
                    >
                      -
                    </button>
                    <span>{productQty}</span>
                    <button
                      onClick={() =>
                        setProductQty((prev) => {
                          return prev + 1;
                        })
                      }
                    >
                      +
                    </button>
                  </div> */}
                    <div className="search-list-cart-button-wrapper">
                       <button
                      type="button"
                      className="filled-button"
                      onClick={() =>
                        toCartHandler({ ...prod, inCartQuantity: productQty })
                      }
                    >
                      <ButtonCartIcon />
                    </button>
                    </div>
                   
                  </li>
                );
              })}
            </ul>
            <div className="product-card-buttons-wrapper search-list-buttins-wrapper">
              <button
                type="button"
                className="filled-text-button"
                onClick={allResultsClickHandler}
              >
                Показати всі
              </button>
              <button
                type="button"
                className="outlined-btn"
                onClick={closeHandler}
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
