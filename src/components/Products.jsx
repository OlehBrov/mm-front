import { useDispatch, useSelector } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars-2";
import {
  selectAuthorization,
  selectDivisions,
  selectFilter,
  selectMerchant,
  selectNewProducts,
  selectSubcategories,
} from "../redux/selectors/selectors";
import { storeApi, useGetAllProductsQuery } from "../api/storeApi";
import { useMemo } from "react";
import { FilterBar } from "./FilterBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { setCategories } from "../redux/features/categorySlice";
import { BounceLoader } from "react-spinners";

import { setFilter } from "../redux/features/filterSlice";

import { ProductCard } from "./ProductCard";
import {
  setDivisions,
  setSubcategories,
} from "../redux/features/subcategoriesSlice";
import { ThumbVertical } from "./ThumbVertical";
import { TrackVertical } from "./TrackVertical";
import { setNewProducts } from "../redux/features/showAddConfirmSlice";
import { EmptyProductsList } from "./EmptyProductsList";
import { EmptyStore } from "./EmptyStore";

export const Products = () => {
  const currentFilter = useSelector(selectFilter);
  const subcategories = useSelector(selectSubcategories);
  const merchantData = useSelector(selectMerchant);

  const [isSubcategoryVisible, setIsSubcategoryVisible] = useState(false);
  const [showDivisionFilter, setShowDivisionFilter] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(1575);
  const [showNoProductsMsg, setShowNoProductsMsg] = useState(false)
  const availableDivisions = useSelector(selectDivisions);
  const subcategoriesRef = useRef(null);
  const navigate = useNavigate();
  const scrollRef = useRef();
  const { isLoading, isSuccess, isError, isFetching, data, error,status } =
    useGetAllProductsQuery({
      // page: page,
      // size: pageSize,
      filter: currentFilter.category,
      subcategory: currentFilter.subcategory,
      division: currentFilter.division,
    });

  useEffect(() => {
    console.log("data", data);
  }, [data]);
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
    console.log('status', status)
    console.log('data.status', data?.status)
    console.log('isSuccess', isSuccess)
    if (isError) {
      console.log("useGetAllProductsQuery error", error);
      // navigate("/epmty-store");
      setShowNoProductsMsg(true)
      return;
    }
    if (isSuccess && data.status === "ok") {
       setShowNoProductsMsg(false);
      const sortedCategories = [...data.categories].sort((a, b) => {
        return a.Categories.category_priority - b.Categories.category_priority;
      });
      data.categories.length && dispatch(setCategories(sortedCategories));
    }
  }, [data, dispatch, error, isError, isSuccess, status]);

  // const substractDivisions = (products) => {
  //   console.log("substractDivisions producrs", products);
  //   return products.reduce((acc, item) => {
  //     const division = item.ProductsDivisions;

  //     // Check if the division_custom_id already exists in acc
  //     if (
  //       !acc.some((d) => d.division_custom_id === division.division_custom_id)
  //     ) {
  //       acc.push(division);
  //     }

  //     return acc;
  //   }, []);
  // };
  useEffect(() => {
    console.log("showNoProductsMsg", showNoProductsMsg);
  }, [showNoProductsMsg]);
  const transformDivisions = (data) => {
    return data.reduce((acc, item) => {
      const category = item.Categories.cat_1C_id;

      const divisionArray = item.divisionData;

      const division = [...divisionArray].sort((a, b) => {
        return a.product_division - b.product_division;
      });
      acc[category] = { division };

      return acc;
    }, {});
  };

  useEffect(() => {
    if (isSuccess && currentFilter.category === 0) {
      const transformedData = transformData(data.subcategories);
      dispatch(setSubcategories(transformedData));

      const transformedDivisions = transformDivisions(data.categories);
      console.log("transformedDivisions", transformedDivisions);
      dispatch(setDivisions(transformedDivisions));
    }
  }, [currentFilter.category, isSuccess]);

  // const divisions = useMemo(() => {
  //   if (isSuccess && currentFilter.category !== 0) {
  //     return substractDivisions(data.products);
  //   }
  //   return [];
  // }, [data, isSuccess, currentFilter.category]);

  useEffect(() => {
    if (isSuccess && currentFilter.category === 0) {
      const transformedData = transformData(data.subcategories);
      dispatch(setSubcategories(transformedData));

      // console.log('division_name: "no division",');
      // dispatch(
      //   setDivisions([
      //     { div_id: 8, division_custom_id: 0, division_name: "no division" },
      //   ])
      // );
    }
    // else if (isSuccess && currentFilter.category !== 0) {
    //   dispatch(setDivisions(divisions)); // Only dispatch if divisions actually changed
    // }
  }, [data, isSuccess, currentFilter.category, dispatch]);

  useEffect(() => {
    if (currentFilter.category === 0 || currentFilter.category === 9999) {
      setIsSubcategoryVisible(false);
    } else {
      setIsSubcategoryVisible(true);
    }
  }, [currentFilter.category]);

  useEffect(() => {
    const subcategoriesHeight = subcategoriesRef.current?.offsetHeight || 0;

    setScrollHeight(1495 - subcategoriesHeight);
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
        division: currentFilter.division,
      })
    );
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.update(); // Refresh scrollbars on layout change
    }
  }, [scrollHeight]);
  useEffect(() => {
    if (
      availableDivisions[currentFilter.category] &&
      availableDivisions[currentFilter.category]?.division?.length > 1
    ) {
      setShowDivisionFilter(true);
    } else setShowDivisionFilter(false);
  }, [availableDivisions, currentFilter.category]);
  // if (data.status === 401) {
  //   return <h1>No products</h1>
  // }
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
      {data?.status === "ok" && (
        <div className="main-wrapper">
          <div className="sidebar">
            <FilterBar hasNewProducts={data.hasNewProducts} />
          </div>

          <div className="main-content">
            {currentFilter.category !== 0 &&
              currentFilter.category !== 9999 && (
                <div className="subcategories-wrapper" ref={subcategoriesRef}>
                  {showDivisionFilter && (
                    <>
                      {/* <h2 className="subcategories-heading">
                        Фільтр за смаком
                      </h2> */}
                      <div className="subcategories-grid divisions-grid">
                        {availableDivisions[currentFilter.category] &&
                          availableDivisions[
                            currentFilter.category
                          ].division.map((division) => {
                            return (
                              <div
                                className="subcategory-radio-wrapper division-radio-wrapper"
                                key={
                                  division.ProductsDivisions.division_custom_id
                                }
                              >
                                <input
                                  type="radio"
                                  name="product-divisions"
                                  id={division.ProductsDivisions.division_name}
                                  className="subcat-filter-radio division-filter-radio"
                                  value={
                                    division.ProductsDivisions
                                      .division_custom_id
                                  }
                                  onChange={() =>
                                    dispatch(
                                      setFilter({
                                        name: currentFilter.name,
                                        category: currentFilter.category,
                                        subcategory: currentFilter.subcategory,
                                        division:
                                          division.ProductsDivisions
                                            .division_custom_id,
                                      })
                                    )
                                  }
                                  checked={
                                    currentFilter.division ===
                                    division.ProductsDivisions
                                      .division_custom_id
                                  }
                                />
                                <label
                                  htmlFor={
                                    division.ProductsDivisions.division_name
                                  }
                                  className="subcat-filter-label division-filter-label"
                                >
                                  {division.ProductsDivisions.division_name}
                                </label>
                              </div>
                            );
                          })}
                      </div>
                    </>
                  )}

                  {/* <h2 className="subcategories-heading">
                    Оберіть підкатегорію продукту
                  </h2> */}
                  <div className="subcategories-grid">
                    <>
                      <div className="subcategory-radio-wrapper">
                        <input
                          type="checkbox"
                          name="product-subcategories"
                          id="all-subcat-filter"
                          className="subcat-filter-radio"
                          value="0"
                          onChange={() =>
                            subcategoryFilterHandler({ product_subcategory: 0 })
                          }
                          checked={currentFilter.subcategory.includes(0)}
                        />
                        <label
                          htmlFor="all-subcat-filter"
                          className="subcat-filter-label"
                        >
                          Всі товари
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
                                  type="checkbox"
                                  name="product-subcategories"
                                  id={subcat.subcategory_name}
                                  className="subcat-filter-radio"
                                  value={subcat.product_subcategory}
                                  onChange={() =>
                                    subcategoryFilterHandler(subcat)
                                  }
                                  checked={currentFilter.subcategory.includes(
                                    subcat.product_subcategory
                                  )}
                                />
                                <label
                                  htmlFor={subcat.subcategory_name}
                                  className="subcat-filter-label"
                                >
                                  {subcat.subcategory_name}
                                </label>
                              </div>
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
                {showNoProductsMsg ? (
                  <EmptyProductsList />
                ) : (
                  data.products.map((el) => (
                    <ProductCard
                      key={el.id}
                      product={el}
                      useVATbyDefault={merchantData.useVATbyDefault}
                      isSingleMerchant={merchantData.isSingleMerchant}
                    />
                  ))
                )}
              </div>
            </Scrollbars>
          </div>
        </div>
      )}
    </div>
  );
};
