import { configureStore } from "@reduxjs/toolkit";
import authorizationReducer from "./features/authSlice";
import categoriesReducer from "./features/categorySlice";
import filterReducer from "./features/filterSlice";
import cartReducer from "./features/cartSlice";
import productsReducer from "./features/productsSlice";
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
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(storeApi.middleware),
});
export const persistor = persistStore(store);
