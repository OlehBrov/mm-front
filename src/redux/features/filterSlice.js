import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
  name: "filter",
  initialState: { name: "all", category: 0, subcategory: 0, categoryName: '' },
  reducers: {
    setFilter: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setFilter } = filterSlice.actions;

export default filterSlice.reducer;
