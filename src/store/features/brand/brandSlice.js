import { createSlice } from '@reduxjs/toolkit'

const brandSlice = createSlice({
  name: 'brand',
  initialState: [],
  reducers: {
    setBrands: (state, action) => {
      return action.payload
    }
  }
})

export const { setBrands } = brandSlice.actions
export default brandSlice.reducer