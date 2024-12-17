import { useDispatch, useSelector } from "react-redux";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import {
  selectFilter,
  selectSubcategories,
} from "../redux/selectors/selectors";
import { useGetAllProductsQuery } from "../api/storeApi";

import { FilterBar } from "./FilterBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { setCategories } from "../redux/features/categorySlice";
import { BounceLoader } from "react-spinners";

import { setSearch } from "../redux/features/searchSlice";
import { setFilter } from "../redux/features/filterSlice";

import Scrollbars from "react-custom-scrollbars-2";


import { ProductCard } from "./ProductCard";
import { setSubcategories } from "../redux/features/subcategoriesSlice";

export const Products = () => {
  const currentFilter = useSelector(selectFilter);
  const subcategories = useSelector(selectSubcategories);
  const [isSubcategoryVisible, setIsSubcategoryVisible] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(1575);
  const subcategoriesRef = useRef(null);
  // const navigate = useNavigate();
  // const location = useLocation();
  const scrollRef = useRef()
  const { isLoading, isSuccess, isError, data, error } = useGetAllProductsQuery(
    {
      // page: page,
      // size: pageSize,
      filter: currentFilter.category,
      subcategory: currentFilter.subcategory,
    }
  );
  // Transform the incoming array
  const transformData = (data) => {
    console.log("transformDatadata", data);
    return data.reduce((acc, item) => {
      const categoryRef = item.Subcategories.category_ref_1C;

      // If this category_ref doesn't exist in the accumulator, add it
      if (!acc[categoryRef]) {
        acc[categoryRef] = [];
      }

      // Push the current subcategory into the array for this category_ref
      acc[categoryRef].push({
        product_subcategory: item.product_subcategory,
        ...item.Subcategories,
      });

      return acc;
    }, {});
  };

  // Example usage with your data

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
      console.log("data.categories", data.categories);
      data.categories.length && dispatch(setCategories(data.categories));
    }
  }, [data, isError, isSuccess]);

  useEffect(() => {
    if (isSuccess && currentFilter.category === 0) {
      const transformedData = transformData(data.subcategories);
      dispatch(setSubcategories(transformedData));
    }
  }, [currentFilter.category, isSuccess]);

  useEffect(() => {
    if (currentFilter.category === 0) {
      setIsSubcategoryVisible(false);
    } else {
      setIsSubcategoryVisible(true);
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
    console.log("currentFilter", currentFilter);
    console.log("subcategories", subcategories);
  }, [currentFilter, subcategories])


  useEffect(() => {
  
  console.log('SimpleBar', SimpleBar); // <- the root element you applied SimpleBar on
})
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
            <FilterBar />
          </div>

          <div className="main-content">
            {currentFilter.category !== 0 && (
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

                    {subcategories[currentFilter.category].map((subcat, i) => {
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
                            onChange={() => subcategoryFilterHandler(subcat)}
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
                    })}
                  </>
                </div>
              </div>
            )}

            <SimpleBar
              
              // renderTrackVertical={(props) => (
              //   <div {...props} className="track-vertical" />
              // )}
              // renderThumbVertical={(props) => (
              //   <div {...props} className="thumb-vertical" />
              // )}
              style={{ width: 700 }}
              forceVisible="y"
              scrollbarMinSize={200}
              
              autoHide={ false}
              // thumbSize={190}
              // autoHeight
              // autoHeightMin={400}
              // autoHeightMax={scrollHeight}
              // universal={true}
            >
              <div className={`products-grid`}>
                {data.products.map((el) => (
                  <ProductCard key={el.id} product={el} />
                ))}
              </div>
            </SimpleBar>
          </div>
        </div>
      )}
    </div>
  );
};
