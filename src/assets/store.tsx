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
import { dealsAPI } from "../features/deals/dealsAPI";
import { settingsAPI } from "../features/settings/settingsAPI";
import { heroBannersAPI } from "../features/banner/bannerAPI";
import { categoriesAPI } from "../features/categories/catagoriesAPI";
import { contactsAPI } from "../features/contacts/contactsAPI";


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
  [dealsAPI.reducerPath]: dealsAPI.reducer,
  [settingsAPI.reducerPath]: settingsAPI.reducer,
  [heroBannersAPI.reducerPath]: heroBannersAPI.reducer,
  [categoriesAPI.reducerPath]: categoriesAPI.reducer,
  [contactsAPI.reducerPath]: contactsAPI.reducer,
 
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
    ordersAPI.middleware,
    dealsAPI.middleware,
    settingsAPI.middleware,
    heroBannersAPI.middleware,
    categoriesAPI.middleware,
    contactsAPI.middleware
    
   
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
