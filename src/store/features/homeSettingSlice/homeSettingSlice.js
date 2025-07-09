import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  homeSettings: []
}

const homeSettingSlice = createSlice({
  name: 'homeSetting',
  initialState,
  reducers: {
    setHomeSettings: (state, action) => {
      state.homeSettings = action.payload
    },
    addHomeSetting: (state, action) => {
      state.homeSettings.push(action.payload)
    },
    updateHomeSetting: (state, action) => {
      const index = state.homeSettings.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.homeSettings[index] = { ...state.homeSettings[index], ...action.payload.data }
      }
    },
    deleteHomeSetting: (state, action) => {
      state.homeSettings = state.homeSettings.filter(item => item.id !== action.payload)
    }
  }
})

export const { setHomeSettings, addHomeSetting, updateHomeSetting, deleteHomeSetting } = homeSettingSlice.actions
export default homeSettingSlice.reducer