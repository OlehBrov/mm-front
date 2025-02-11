import { createSlice, nanoid } from "@reduxjs/toolkit";

export const subcategoriesSlice = createSlice({
  name: "subcategories",
  initialState: [],
  reducers: {
    setSubcategories: (state, action) => {
      console.log("setSubcategories action.payload", typeof action.payload);


        return state = action.payload
    },
  },
});

export const { setSubcategories } = subcategoriesSlice.actions;

export default subcategoriesSlice.reducer;
