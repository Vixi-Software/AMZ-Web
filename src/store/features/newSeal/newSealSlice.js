import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [], // Danh sách thương hiệu
  priceRanges: [], // Danh sách khoảng giá, ví dụ: [{ min: 0, max: 500000 }, ...]
};

const newSealSlice = createSlice({
  name: 'newSeal',
  initialState,
  reducers: {
    setBrands(state, action) {
      state.brands = action.payload;
    },
    setPriceRanges(state, action) {
      state.priceRanges = action.payload;
    },
    addBrand(state, action) {
      state.brands.push(action.payload);
    },
    addPriceRange(state, action) {
      state.priceRanges.push(action.payload);
    },
    removeBrand(state, action) {
      state.brands = state.brands.filter(brand => brand !== action.payload);
    },
    removePriceRange(state, action) {
      state.priceRanges = state.priceRanges.filter(
        range => range.min !== action.payload.min || range.max !== action.payload.max
      );
    },
  },
});

export const {
  setBrands,
  setPriceRanges,
  addBrand,
  addPriceRange,
  removeBrand,
  removePriceRange,
} = newSealSlice.actions;

export default newSealSlice.reducer;