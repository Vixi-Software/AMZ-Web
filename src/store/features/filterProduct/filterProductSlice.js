import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: null,
  brands: [],
  priceRanges: [],
  // needs: [],
};

const filterProductSlice = createSlice({
  name: 'filterProduct',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setPriceRanges: (state, action) => {
      state.priceRanges = action.payload;
    },
    // setNeeds: (state, action) => {
    //   state.needs = action.payload;
    // },
    resetFilter: (state) => {
      state.brands = [];
      state.priceRanges = [];
      state.needs = [];
      // Không reset category
    },
  },
});

export const { setCategory, setBrands, setPriceRanges, setNeeds, resetFilter } = filterProductSlice.actions;
export default filterProductSlice.reducer;