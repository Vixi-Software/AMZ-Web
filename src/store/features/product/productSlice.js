import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  product: null,
  randomProducts: [],
  productData: [], // Thêm dòng này
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProduct(state, action) {
      state.product = action.payload;
    },
    clearProduct(state) {
      state.product = null;
    },
    setRandomProducts(state, action) { 
      state.randomProducts = action.payload;
    },
    clearRandomProducts(state) { 
      state.randomProducts = [];
    },
    setProductData(state, action) {
      state.productData = action.payload;
    },
  },
});

export const { setProduct, clearProduct, setRandomProducts, clearRandomProducts, setProductData } = productSlice.actions;
export default productSlice.reducer;