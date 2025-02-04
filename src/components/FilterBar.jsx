import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories, selectFilter } from "../redux/selectors/selectors";
import { setFilter } from "../redux/features/filterSlice";
import { HomeIcon } from "./icons/HomeIcon";

export const FilterBar = () => {
  const categories = useSelector(selectCategories);
  const filter = useSelector(selectFilter);

  const dispatch = useDispatch();

  const handleFilterClick = (selectedFilter) => {
    dispatch(setFilter(selectedFilter));
  };
  return (
    <ul className="filter-list">
      {" "}
      <li className="filter-item">
        <input
          type="radio"
          name="product-categories"
          id="all-filter"
          className="filter-radio"
          value="0"
          onChange={() =>
            handleFilterClick({
              name: "all",
              category: 0,
              subcategory: 0,
              categoryName: "",
            })
          }
          checked={filter.category === 0}
        />
        <label htmlFor="all-filter" className="filter-label">
          {/* <div className="filter-button-icon-wrapper"> */}
            <HomeIcon />
            {/* <img
              src="img/icons/home.svg"
              alt=""
              className="filter-button-icon"
            /> */}
          {/* </div> */}
          <span className="filter-label-text">Головна</span>
        </label>

        {/* <button
          className="filter-button"
          type="button"
          data-category="all"
          onClick={() =>
            handleFilterClick({
              name: "all",
              category: 0,
              subcategory: 0,
              categoryName: "",
            })
          }
        >
          <div className="filter-button-icon-wrapper">
            <img
              src="/img/icons/home.svg"
              alt=""
              className="filter-button-icon"
            />
          </div>
          На головну
        </button> */}
      </li>
      {categories.map((el) => {
        return (
          <li key={el.categoryId} className="filter-item">
            <input
              type="radio"
              name="product-categories"
              id={el.categoryName}
              className="filter-radio"
              value={el.categoryId}
              onChange={() =>
                handleFilterClick({
                  name: el.categoryName,
                  category: el.categoryId,
                  subcategory: 0,
                  categoryName: el.categoryName,
                })
              }
              checked={filter.category === el.categoryId}
            />
            <label htmlFor={el.categoryName} className="filter-label">
              <div className="filter-button-icon-wrapper">
                <img
                  src={el.categoryImage}
                  alt=""
                  className="filter-button-icon"
                />
              </div>
              <span className="filter-label-text">{el.categoryName}</span>
            </label>
            {/* <button
            className="filter-button"
            type="button"
            data-category={el.categoryName}
            onClick={() =>
              handleFilterClick({
                name: el.categoryName,
                category: el.categoryId,
                subcategory: 0,
                categoryName: el.categoryName,
              })
            }
          >
            {" "}
            <div className="filter-button-icon-wrapper">
              <img
                src={el.categoryImage}
                alt=""
                className="filter-button-icon"
              />
            </div>
            <div className="devider" />
            {el.categoryName}
          </button> */}
          </li>
        );
      })}
    </ul>
  );
};
