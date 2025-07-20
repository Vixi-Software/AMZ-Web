import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: "",
  starDate: "",
  endDate: "",
  name: "",
  linkBanner: "",
  content:""
};

const saleSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    setSale(state, action) {
      state.sale = action.payload;
    },
    clearSale(state) {
      state.sale = null;
    },
  },
});

export const { setSale, clearSale } = saleSlice.actions;
export default saleSlice.reducer;