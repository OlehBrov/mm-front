import { useDispatch, useSelector } from "react-redux";
import { selectFilter } from "../redux/selectors/selectors";
import { useGetAllProductsQuery } from "../api/storeApi";
import { addToCart } from "../redux/features/cartSlice";
import { FilterBar } from "./FilterBar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { setCategories } from "../redux/features/categorySlice";
import { RiseLoader } from "react-spinners";
import Pagination from "rc-pagination";
import { setSearch } from "../redux/features/searchSlice";
import { setFilter } from "../redux/features/filterSlice";
import { ProductDetails } from "./ProductDetails";
import { ButtonCartIcon } from "./icons/ButtonCartIcon";
import Scrollbars from "react-custom-scrollbars-2";
// import {useGetAllContactsQuery} from "../api/productsApi";

export const Products = () => {
  const currentFilter = useSelector(selectFilter);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isQtyModifierOpen, setIsQtyModifierOpen] = useState(false);
  const [productQty, setProductQty] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [isSubcategoryVisible, setIsSubcategoryVisible] = useState(false);
  const scrollbarsRef = useRef(null);

  const { isLoading, isSuccess, isError, data, error } = useGetAllProductsQuery(
    {
      // page: page,
      // size: pageSize,
      filter: currentFilter.category,
      subcategory: currentFilter.subcategory,
    }
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSearch(""));
  }, []);
  useEffect(() => {
    if (isError) {
      console.log("useGetAllProductsQuery error", error);
      // navigate("/");
      return;
    }
    if (isSuccess) {
      console.log("isSuccess data", data);
      // data &&
      setTotalProducts(data.totalProducts);
      // data?.products.length &&
      data.categories.length && dispatch(setCategories(data.categories));
    }
  }, [data, isError, isSuccess]);

  useEffect(() => {
    console.log("currentFilter.category", currentFilter.category);
    if (currentFilter.category === 0) {
      setIsSubcategoryVisible(false);

      console.log("setIsSubcategoryVisible(false)");
    } else {
      setIsSubcategoryVisible(true);

      console.log("setIsSubcategoryVisible(false)");
    }
  }, [currentFilter.category]);

  const buyButtonHandler = (productToBuy) => {
    dispatch(addToCart(productToBuy));
  };

  const paginationHandler = (current, pageSize) => {
    setPage(current);
    window.scrollTo(0, 0);
  };

  const productQtyHandler = (product) => {
    setIsQtyModifierOpen(true);
    setSelectedProduct(product);
    console.log("productQtyHandler product", product);
  };
  const modifierHandler = (el) => {
    dispatch(addToCart({ ...selectedProduct, inCartQuantity: productQty }));
    setIsQtyModifierOpen(false);
    setSelectedProduct({});
  };
  const subcategoryFilterHandler = (subcategory) => {
    dispatch(
      setFilter({
        name: currentFilter.name,
        category: currentFilter.category,
        subcategory: subcategory.product_subcategory,
      })
    );
  };

  const itemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return (
        <button className="custom-arrow prev-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="20"
            viewBox="0 0 26 20"
            fill="none"
          >
            <path
              d="M15.673 1.25171L24.4213 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.57874 10L24.4213 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.673 18.7483L24.4213 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      );
    }
    if (type === "next") {
      return (
        <button className="custom-arrow next-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="20"
            viewBox="0 0 26 20"
            fill="none"
          >
            <path
              d="M15.673 1.25171L24.4213 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.57874 10L24.4213 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.673 18.7483L24.4213 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      );
    }
    if (type === "page") {
      return (
        <button className={`custom-page ${page === current ? "active" : ""}`}>
          {current}
        </button>
      );
    }
    return originalElement; // For jump-prev, jump-next, etc.
  };
  const handleProductClick = (e, el) => {
    e.preventDefault();
    // buyButtonHandler({ ...el, inCartQuantity: 1 })
    dispatch(addToCart({ ...el, inCartQuantity: 1 }));
  };
  return (
    <div className="products-container">
      {isQtyModifierOpen && (
        <ProductDetails
          selectedProduct={selectedProduct}
          productQty={productQty}
          setProductQty={setProductQty}
          modifierHandler={modifierHandler}
          setIsQtyModifierOpen={setIsQtyModifierOpen}
        />
      )}
      {isLoading && <RiseLoader color="#36d7b7" loading size={30} />}
      {isSuccess && (
        <div className="main-wrapper">
          <div className="sidebar">
            <FilterBar />
          </div>

          <div className="main-content">
            <div className="subcategories-grid">
              {isSubcategoryVisible &&
                data.subcategories.map((subcat) => {
                  return (
                    <button
                      key={subcat.product_subcategory}
                      className="outlined-btn"
                      type="button"
                      onClick={() => subcategoryFilterHandler(subcat)}
                    >
                      {subcat.Subcategories.subcategory_name}
                    </button>
                  );
                })}
            </div>
            <Scrollbars
             
              renderTrackVertical={(props) => (
                <div {...props} className="track-vertical" />
              )}
              renderThumbVertical={(props) => (
                <div {...props} className="thumb-vertical" />
              )}
              style={{ width: 740, height: 1500, paddingTop: 20 }}
              thumbSize={190}
            >
              <div className={`products-grid`}>
                {data.products.map((el) => (
                  <Link
                    key={el.id}
                    className={`product-card `}
                    onClick={(e) =>
                      // buyButtonHandler({ ...el, inCartQuantity: 1 })
                      handleProductClick(e, el)
                    }
                  >
                    <div className={`product-image-wrapper`}>
                      <img
                        className={`product-image`}
                        src={el.product_image}
                        alt=""
                      />
                    </div>
                    <div className={`product-card-footer`}>
                      <div className="product-card-text-wrapper">
                        <p className="product-card-name">{el.product_name}</p>
                        <p className="product-card-light-text">
                          {el.product_price} грн.
                        </p>
                        {el.discount && (
                          <p>Знижка {el.Products.discount * 100}%</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Scrollbars>
            {/* <div className="pagination-wrapper">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={totalProducts}
                onChange={paginationHandler}
                hideOnSinglePage={true}
                showPrevNextJumpers={true}
                itemRender={itemRender}
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
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};
