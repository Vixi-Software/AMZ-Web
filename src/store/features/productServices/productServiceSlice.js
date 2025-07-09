import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  productSelected: null,
};

const productServiceSlice = createSlice({
  name: 'productService',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProductSelected: (state, action) => {
      state.productSelected = action.payload;
    },
  },
});

export const { setProducts, setProductSelected } = productServiceSlice.actions;
export default productServiceSlice.reducer;