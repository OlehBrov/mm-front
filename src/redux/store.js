import { configureStore } from "@reduxjs/toolkit";
import authorizationReducer from "./features/authSlice";
import categoriesReducer from "./features/categorySlice";
import filterReducer from "./features/filterSlice";
import cartReducer from "./features/cartSlice";
import showAddConfirmReducer from "./features/showAddConfirmSlice";
import searchReducer from "./features/searchSlice";
import detailedProductReducer from "./features/detailedProductSlice";
import selectedQuantityReducer from "./features/selectedQuantitySlice";
import subcategoriesReducer from "./features/subcategoriesSlice";
import recieptReducer from "./features/recieptSlice";
import buyStatusReducer from "./features/buyStatus";
import terminalStateReducer from "./features/terminalSlice";
import merchantReducer from "./features/merchantsSlice";
import notifyReducer from "./features/notifySlice"

import { storeApi } from "../api/storeApi";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "authLocal",
  storage,
};
const persistedauthorizationReducer = persistReducer(
  persistConfig,
  authorizationReducer
);
export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    filter: filterReducer,
    cart: cartReducer,
    authLocal: persistedauthorizationReducer,
    [storeApi.reducerPath]: storeApi.reducer,
    showAddConfirm: showAddConfirmReducer,
    search: searchReducer,
    detailedProduct: detailedProductReducer,
    selectedQuantity: selectedQuantityReducer,
    subcategories: subcategoriesReducer,
    reciept: recieptReducer,
    buyStatus: buyStatusReducer,
    terminalState: terminalStateReducer,
    merchant: merchantReducer,
    notify: notifyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(storeApi.middleware),
});
export const persistor = persistStore(store);
