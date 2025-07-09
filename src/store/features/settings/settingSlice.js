import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  home: {}, 
}

const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setHome: (state, action) => {
      state.home = action.payload
    },
  }
})

export const { setTheme, setLanguage, setHome } = settingSlice.actions
export default settingSlice.reducer