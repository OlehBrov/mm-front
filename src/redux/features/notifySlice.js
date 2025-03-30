import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isNotifyOpen: false,
  isIdleOpen: false,
  idleOpenChecking: false,
  showNoProdError: false,
  timeout: 60000,
  promptBeforeIdle: 0,
};

const notifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {
    setIsNotifyOpen: (state, action) => {
      state.isNotifyOpen = action.payload;
    },
    setIsIdleOpen: (state, action) => {
      state.isIdleOpen = action.payload;
    },
    setIdleOpenChecking: (state, action) => {
      state.idleOpenChecking = action.payload;
    },
    setNoProdError: (state, action) => {
      state.showNoProdError = action.payload;
    },
    setPromptBeforeIdle: (state, action) => {
      state.promptBeforeIdle = action.payload;
    },
  },
});

export const {
  setIsNotifyOpen,
  setIsIdleOpen,
  setIdleOpenChecking,
  setNoProdError,
  setPromptBeforeIdle,
} = notifySlice.actions;

export default notifySlice.reducer;
