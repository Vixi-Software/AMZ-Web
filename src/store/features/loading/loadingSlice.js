import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
}

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    startLoading: (state) => {
      state.isLoading = true
    },
    stopLoading: (state) => {
      state.isLoading = false
    },
  },
})

export const { setLoading, startLoading, stopLoading } = loadingSlice.actions
export default loadingSlice.reducer