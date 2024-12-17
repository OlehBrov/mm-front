import { createSlice } from "@reduxjs/toolkit";

const selectedQuantitySlice = createSlice({
  name: "selectedQuantity",
  initialState: {
    totalSelected: 0,
    totalRemain: 0,
    mainSelected: 0,
    childSelected: 0,
    maxAvailable: 0,
  },
  reducers: {
    setMaxAvailable: (state, action) => {
      state.maxAvailable = action.payload;
      state.totalRemain = action.payload - state.totalSelected;
    },
    setTotalSelected: (state, action) => {
      state.totalSelected = action.payload;
      state.totalRemain = state.totalRemain - action.payload;
    },
    setMainSelected: (state, action) => {
      state.mainSelected = action.payload;
      state.totalSelected = action.payload;
    },

    incrementMainSelected: (state, action) => {
      if (state.totalSelected < state.maxAvailable) {
        state.mainSelected += action.payload;
        state.totalSelected += action.payload;
        state.totalRemain = state.totalRemain - action.payload;
      }
    },
    decrementMainSelected: (state, action) => {
      if (state.totalSelected > 0) {
        state.mainSelected -= action.payload;
        state.totalSelected -= action.payload;
        state.totalRemain = state.totalRemain + action.payload;
      }
    },

    incrementChildSelected: (state, action) => {
      if (state.totalSelected < state.maxAvailable) {
        state.childSelected += action.payload;
        state.totalSelected += action.payload;
        state.totalRemain = state.totalRemain - action.payload;
      }
    },
    decrementChildSelected: (state, action) => {
      if (state.totalSelected > 0) {
        state.childSelected -= action.payload;
        state.totalSelected -= action.payload;
        state.totalRemain = state.totalRemain + action.payload;
      }
    },

    incrementTotalSelected: (state, action) => {
      if (state.totalSelected < state.maxAvailable) {
        state.totalSelected += action.payload;
        state.totalRemain = state.totalRemain - action.payload;
      }
    },
    decrementTotalSelected: (state, action) => {
      if (state.totalSelected > 0) {
        state.totalSelected -= action.payload;
        state.totalRemain = state.totalRemain + action.payload;
      }
    },
    resetTotalSelected: (state) => {
      state.totalSelected = 0;
      state.totalRemain = 0;
      state.mainSelected = 0;
      state.childSelected = 0;
      state.maxAvailable = 0;
    },
  },
});

export const {
  setMaxAvailable,
  setTotalSelected,
  incrementTotalSelected,
  decrementTotalSelected,
  resetTotalSelected,
  incrementMainSelected,
  decrementMainSelected,
  incrementChildSelected,
  decrementChildSelected,
  setMainSelected,
} = selectedQuantitySlice.actions;

export default selectedQuantitySlice.reducer;
