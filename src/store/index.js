import { configureStore } from '@reduxjs/toolkit';
import loadingMiddleware from './features/loading/loadingMiddleware';
// ...import other reducers...

const store = configureStore({
  reducer: {
    // ...add your reducers here...
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loadingMiddleware),
});

export default store;