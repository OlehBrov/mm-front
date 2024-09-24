import { useDispatch, useSelector } from "react-redux";
import { selectFilter } from "../redux/selectors/selectors";
import { useGetAllProductsQuery } from "../api/storeApi";
import { addToCart } from "../redux/features/cartSlice";
import { FilterBar } from "./FilterBar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setCategories } from "../redux/features/categorySlice";
import { RiseLoader } from "react-spinners";
import Pagination from "rc-pagination";
// import {useGetAllContactsQuery} from "../api/productsApi";

export const Products = () => {
  const currentFilter = useSelector(selectFilter);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 10;
  const { isLoading, isSuccess, isError, data, error } = useGetAllProductsQuery(
    { page: page, filter: currentFilter.id }
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      console.log("useGetAllProductsQuery error", error);
      // navigate("/");
      return;
    }
    console.log("data", data);
    data && setTotalProducts(data.totalProducts);
    data?.products.length && dispatch(setCategories(data.categories));
  }, [data, isError, isSuccess]);

  const buyButtonHandler = (productToBuy) => {
    dispatch(addToCart(productToBuy));
  };

  const paginationHandler = (current, pageSize) => {
    setPage(current);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container products-container">
      <h1>Products</h1>
      {isLoading && <RiseLoader color="#36d7b7" loading size={30} />}
      {isSuccess && (
        <>
          <div className="sidebar">
            <h3>Категорії продуктів</h3>
            <FilterBar />
          </div>
          <div></div>

          <div className="cart-link-wrapper">
            <Link to={"/cart"} className="cart-button">
              Go to cart
            </Link>
          </div>
          <div className={`products-grid`}>
            {data.products.map((el) => (
              <div key={el.product_id} className={`product-card `}>
                <div className={`product-image-wrapper`}>
                  <img
                    className={`product-image`}
                    src={el.Products.image}
                    alt=""
                  />
                </div>
                <div className={`product-card-footer`}>
                  <h3>{el.Products.product_name}</h3>
                  <p>Price: {el.Products.price}</p>
                  {el.Products.discount && (
                    <p>Знижка {el.Products.discount * 100}%</p>
                  )}

                  <button type="button" onClick={() => buyButtonHandler(el)}>
                    BUY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Pagination
        current={page}
        pageSize={pageSize}
        total={totalProducts}
        onChange={paginationHandler}
        hideOnSinglePage={true}
        locale={{
          // Options
          items_per_page: "/ сторінці",
          jump_to: "Перейти",
          jump_to_confirm: "підтвердити",
          page: "",

          // Pagination
          prev_page: "Попередня сторінка",
          next_page: "Наступна сторінка",
          prev_5: "Попередні 5 сторінок",
          next_5: "Наступні 5 сторінок",
          prev_3: "Попередні 3 сторінки",
          next_3: "Наступні 3 сторінки",
          page_size: "Page Size",
        }}
        className="pagination"
      />
    </div>
  );
};
