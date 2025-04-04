import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
  name: "filter",
  initialState: {
    name: "all",
    category: 0,
    subcategory: [0],
    categoryName: "",
    division: 0,
  },
  reducers: {
    setFilter: (state, action) => {
      const prevDivision = state.division;
      const { name, category, subcategory, categoryName, division } = action.payload;
      // If the new subcategory is 0, reset the array to [0]
      if (subcategory === 0) {
        return {
          ...state,
          name,
          category,
          subcategory: [0], // Reset to default
          categoryName,
          division: 0,
        };
      }
      const shouldUpdateOnlyDivision = prevDivision !== division;
      if (shouldUpdateOnlyDivision) {
        return {
          ...state,
          division: division,
        };
      } else {
        // Otherwise, we need to update the subcategory array
        let updatedSubcategories = state.subcategory.filter((sc) => sc !== 0); // Remove 0 if exists
        const subcatIndex = updatedSubcategories.indexOf(subcategory);

        if (subcatIndex !== -1) {
          // If already exists, remove it (toggle behavior)
          updatedSubcategories.splice(subcatIndex, 1);
        } else {
          // Otherwise, add the new subcategory
          updatedSubcategories.push(subcategory);
        }

        // If no subcategories remain, reset to [0]
        if (updatedSubcategories.length === 0) {
          updatedSubcategories = [0];
        }

        return {
          ...state,
          name,
          category,
          subcategory: updatedSubcategories,
          categoryName: name,
          division: division,
        };
      }
    },

    clearFilter: (state, action) => {
      return (state = {
        name: "all",
        category: 0,
        subcategory: [0],
        categoryName: "",
        division: 0,
      });
    },
  },
});

export const { setFilter } = filterSlice.actions;

export default filterSlice.reducer;
