// src/features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
  typeRangePrice: null // Thêm biến typeRangePrice
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    setTypeRangePrice: (state, action) => {
      state.typeRangePrice = action.payload // Thêm reducer setTypeRangePrice
    }
  }
})

export const { increment, decrement, setTypeRangePrice } = counterSlice.actions
export default counterSlice.reducer
