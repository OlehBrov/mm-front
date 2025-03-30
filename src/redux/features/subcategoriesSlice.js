import { createSlice, nanoid } from "@reduxjs/toolkit";

export const subcategoriesSlice = createSlice({
  name: "subcategories",
  initialState: {
    subcategoryList: [],
    divisions: [
      { div_id: 8, division_custom_id: 0, division_name: "no division" },
    ],
  },
  reducers: {
    setSubcategories: (state, action) => {
      state.subcategoryList = action.payload;
    },
    setDivisions: (state, action) => {
      state.divisions = action.payload;
    },
  },
});

export const { setSubcategories, setDivisions } = subcategoriesSlice.actions;

export default subcategoriesSlice.reducer;
