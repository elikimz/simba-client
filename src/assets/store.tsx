import { configureStore, combineReducers } from "@reduxjs/toolkit";
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
import storage from "redux-persist/lib/storage";
import { authAPI } from "../features/register/registerAPI";
import { productsAPI } from "../features/products/productsAPI"; 
import {cartAPI} from "../features/cart/cartAPI"
import { addressesAPI } from "../features/addresses/addressAPI";
import { ordersAPI } from "../features/order/orderAPI";


const persistConfig = {
  key: "root",
  storage,
  whitelist: [], // or add non-API slice names here
};

// Combine reducers
const rootReducer = combineReducers({
  [authAPI.reducerPath]: authAPI.reducer,
  [productsAPI.reducerPath]: productsAPI.reducer,
  [cartAPI.reducerPath]: cartAPI.reducer,
  [addressesAPI.reducerPath]: addressesAPI.reducer,
  [ordersAPI.reducerPath]: ordersAPI.reducer,
 
});

// Only wrap persistable slices
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer, // <--- use persistedReducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
    authAPI.middleware,
    productsAPI.middleware,
    cartAPI.middleware,
    addressesAPI.middleware,
    ordersAPI.middleware
   
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
