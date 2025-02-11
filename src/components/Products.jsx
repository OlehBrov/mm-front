import { useDispatch, useSelector } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars-2";
import {
  selectAuthorization,
  selectFilter,
  selectMerchant,
  selectNewProducts,
  selectSubcategories,
} from "../redux/selectors/selectors";
import { storeApi, useGetAllProductsQuery } from "../api/storeApi";

import { FilterBar } from "./FilterBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { setCategories } from "../redux/features/categorySlice";
import { BounceLoader } from "react-spinners";

import { setFilter } from "../redux/features/filterSlice";

import { ProductCard } from "./ProductCard";
import { setSubcategories } from "../redux/features/subcategoriesSlice";
import { ThumbVertical } from "./ThumbVertical";
import { TrackVertical } from "./TrackVertical";

export const Products = () => {
  const currentFilter = useSelector(selectFilter);
  const subcategories = useSelector(selectSubcategories);
  const merchantData = useSelector(selectMerchant);

  const [isSubcategoryVisible, setIsSubcategoryVisible] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(1575);
  const subcategoriesRef = useRef(null);

  const scrollRef = useRef();
  const { isLoading, isSuccess, isError, isFetching, data, error } =
    useGetAllProductsQuery({
      // page: page,
      // size: pageSize,
      filter: currentFilter.category,
      subcategory: currentFilter.subcategory,
    });

  const transformData = (data) => {

    return data.reduce((acc, item) => {
      const categoryRef = item.Subcategories.category_ref_1C;
      const allInOneProductsRef = 9999;

      if (!acc[allInOneProductsRef]) {
        acc[allInOneProductsRef] = [];
      }
      if (acc[allInOneProductsRef]) {
        acc[allInOneProductsRef].push({
          product_subcategory: item.product_subcategory,
          ...item.Subcategories,
        });
      }

      if (!acc[categoryRef]) {
        acc[categoryRef] = [];
      }

      acc[categoryRef].push({
        product_subcategory: item.product_subcategory,
        ...item.Subcategories,
      });

      return acc;
    }, {});
  };

  const dispatch = useDispatch();
  useEffect(() => {
  console.log('data', data)
}, [data])
  useEffect(() => {
    if (isError) {
      console.log("useGetAllProductsQuery error", error);
      // navigate("/");
      return;
    }
    if (isSuccess) {
      const sortedCategories = [...data.categories].sort((a, b) => {
        return a.Categories.category_priority - b.Categories.category_priority;
      });
      data.categories.length && dispatch(setCategories(sortedCategories));
      console.log("sortedCategories", sortedCategories);
    }
  }, [data, isError, isSuccess]);

  useEffect(() => {
    if (isSuccess && currentFilter.category === 0) {
      const transformedData = transformData(data.subcategories);
      dispatch(setSubcategories(transformedData));
    }
  }, [currentFilter.category, isSuccess]);

  useEffect(() => {
    if (currentFilter.category === 0 || currentFilter.category === 9999) {
      console.log("setIsSubcategoryVisible(false);");
      setIsSubcategoryVisible(false);
    } else {
      setIsSubcategoryVisible(true);
      console.log("setIsSubcategoryVisible(true);");
    }
  }, [currentFilter.category]);

  useEffect(() => {
    const subcategoriesHeight = subcategoriesRef.current?.offsetHeight || 0;

    setScrollHeight(1575 - subcategoriesHeight);
  }, [
    isSubcategoryVisible,
    subcategoriesRef.current?.offsetHeight,
    currentFilter.category,
  ]);

  const subcategoryFilterHandler = (subcategory) => {
    dispatch(
      setFilter({
        name: currentFilter.name,
        category: currentFilter.category,
        subcategory: subcategory.product_subcategory,
      })
    );
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.update(); // Refresh scrollbars on layout change
    }
  }, [scrollHeight]);
  return (
    <div className="products-container">
      <div className="circle-800 circle-635" />
      {isLoading && (
        <div className="loader-wrapper">
          <BounceLoader size={350} color={"#FF6A14"} />
          <div className="loader-text-wrap">
            <h1 className="loader-text">Триває підключення до терміналу</h1>
          </div>
        </div>
      )}
      {isSuccess && (
        <div className="main-wrapper">
          <div className="sidebar">
            <FilterBar hasNewProducts={data.hasNewProducts} />
          </div>

          <div className="main-content">
            {currentFilter.category !== 0 &&
              currentFilter.category !== 9999 && (
                <div className="subcategories-wrapper" ref={subcategoriesRef}>
                  <h2 className="subcategories-heading">
                    Оберіть підкатегорію продукту
                  </h2>
                  <div className="subcategories-grid">
                    <>
                      <div className="subcategory-radio-wrapper">
                        <input
                          type="radio"
                          name="product-subcategories"
                          id="all-subcat-filter"
                          className="subcat-filter-radio"
                          value="0"
                          onChange={() =>
                            subcategoryFilterHandler({ product_subcategory: 0 })
                          }
                          checked={currentFilter.subcategory === 0}
                        />
                        <label
                          htmlFor="all-subcat-filter"
                          className="subcat-filter-label"
                        >
                          Всі продукти
                        </label>
                      </div>

                      {subcategories[currentFilter.category] &&
                        subcategories[currentFilter.category].map(
                          (subcat, i) => {
                            return (
                              <div
                                className="subcategory-radio-wrapper"
                                key={subcat.product_subcategory}
                              >
                                <input
                                  type="radio"
                                  name="product-subcategories"
                                  id={subcat.subcategory_name}
                                  className="subcat-filter-radio"
                                  value={subcat.product_subcategory}
                                  onChange={() =>
                                    subcategoryFilterHandler(subcat)
                                  }
                                  checked={
                                    currentFilter.subcategory ===
                                    subcat.product_subcategory
                                  }
                                />
                                <label
                                  htmlFor={subcat.subcategory_name}
                                  className="subcat-filter-label"
                                >
                                  {subcat.subcategory_name}
                                </label>
                              </div>
                              // <button
                              //   key={subcat.product_subcategory}
                              //   className="outlined-btn subcategories-button"
                              //   type="button"
                              //   onClick={() => subcategoryFilterHandler(subcat)}
                              // >
                              //   {subcat.subcategory_name}
                              // </button>
                            );
                          }
                        )}
                    </>
                  </div>
                </div>
              )}

            <Scrollbars
              ref={scrollRef}
              renderTrackVertical={TrackVertical}
              renderThumbVertical={(props) => ThumbVertical(props, scrollRef)}
              style={{ width: 740 }}
              thumbSize={190}
              autoHeight
              autoHeightMin={400}
              autoHeightMax={scrollHeight}
              hideTracksWhenNotNeeded={true}
            >
              <div className={`products-grid`}>
                {data.products.map((el) => (
                  <ProductCard
                    key={el.id}
                    product={el}
                    useVATbyDefault={merchantData.useVATbyDefault}
                    isSingleMerchant={merchantData.isSingleMerchant}
                  />
                ))}
              </div>
            </Scrollbars>
          </div>
        </div>
      )}
    </div>
  );
};
