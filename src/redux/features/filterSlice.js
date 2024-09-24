import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
  name: "filter",
  initialState: {name: "all", id: 0},
  reducers: {
    setFilter: (state, action) => {
      console.log('action.payload', action.payload)
      return state = action.payload
    }
  },
});

export const { setFilter } = filterSlice.actions;

export default filterSlice.reducer;
