// src/app/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import counterReducer from '../store/features/counter/counterSlice'
import productReducer from '../store/features/product/productSlice'
import filterProduct from '../store/features/filterProduct/filterProductSlice'
import postReducer from '../store/features/post/postSlice'
import brandReducer from '../store/features/brand/brandSlice'
import loadingReducer from '../store/features/loading/loadingSlice'
import settingsReducer from '../store/features/settings/settingSlice'
import authReducer from '../store/features/auth/authSlice'
import productServiceReducer from '../store/features/productServices/productServiceSlice'
import homeSettingReducer from '../store/features/homeSettingSlice/homeSettingSlice'
import postServiceReducer from '../store/features/postServices/postServiceSlice'
import newSealReducer from '../store/features/newSeal/newSealSlice'
import allDataReducer from '../store/features/allData/allDataSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'

// ✨ Thay storage từ localStorage sang indexedDB
import createIndexedDBStorage from 'redux-persist-indexeddb-storage'
import { encryptTransform } from 'redux-persist-transform-encrypt'

// ✅ Tạo storage từ indexedDB
const storage = createIndexedDBStorage('MyAppDB')

const rootReducer = combineReducers({
  counter: counterReducer,
  product: productReducer,
  filterProduct,
  post: postReducer,
  brand: brandReducer,
  loading: loadingReducer,
  settings: settingsReducer,
  auth: authReducer,
  productService: productServiceReducer,
  homeSetting: homeSettingReducer,
  postService: postServiceReducer,
  newSeal: newSealReducer,
  allData: allDataReducer 
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'counter',
    'filterProduct',
    'post',
    'brand',
    'loading',
    'settings',
    'auth',
    'product',
    'productService',
    'homeSetting',
    'postService',
    'newSeal',
    'allData' // Thêm allData vào whitelist nếu cần
  ],
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_PERSIST_SECRET_KEY,
    })
  ]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
