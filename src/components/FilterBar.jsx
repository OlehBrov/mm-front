import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories } from "../redux/selectors/selectors";
import { setFilter } from "../redux/features/filterSlice";

export const FilterBar = () => {
  const categories = useSelector(selectCategories);

  const dispatch = useDispatch();

  const handleFilterClick = (selectedFilter) => {
    dispatch(setFilter(selectedFilter));
  };
  return (
    <div>
      <ul className="filter-list">
        {categories.map((el) => (
          <li key={el.categoryId} className="filter-item">
            <button
              className="filter-button"
              type="button"
              data-category={el.categoryName}
              onClick={() => handleFilterClick({name: el.categoryName, id: el.categoryId})}
            >
              {el.categoryName}
            </button>
          </li>
        ))}
        <li className="filter-item">
          <button
            className="filter-button"
            type="button"
            data-category="all"
            onClick={() => handleFilterClick({name: "all", id: 0})}
          >
            All
          </button>
        </li>
      </ul>
    </div>
  );
};
