import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: { searchQuery: "", searchResults: [] },
  reducers: {
    setSearch: (state, action) => {
      console.log("action.payload", action.payload);
      state.searchQuery = action.payload;
      },
      setSearchResults: (state, action) => {
          state.searchResults = action.payload
      },
      clearSearchResults: (state) => {
          state.searchResults =[]
      }
  },
});

export const { setSearch, setSearchResults, clearSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
