import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
  taiNgheNhetTai: [],
  loaDeBan: [],
  loaKaraoke: [],
  newSealTaiNghe: [],
  taiNgheChupTai: [],
  loaDiDong: [],
}

const allDataSlice = createSlice({
  name: 'allData',
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload
      state.loading = false
      state.error = null
    },
    setTaiNgheNhetTai(state, action) {
      state.taiNgheNhetTai = action.payload
    },
    setLoaDeBan(state, action) {
      state.loaDeBan = action.payload
    },
    setLoaKaraoke(state, action) {
      state.loaKaraoke = action.payload
    },
    setNewSealTaiNghe(state, action) {
      state.newSealTaiNghe = action.payload
    },
    setTaiNgheChupTai(state, action) {
      state.taiNgheChupTai = action.payload
    },
    setLoaDiDong(state, action) {
      state.loaDiDong = action.payload
    }
  }
})

export const { setData, setTaiNgheNhetTai, setLoaDeBan, setLoaKaraoke, setNewSealTaiNghe, setTaiNgheChupTai, setLoaDiDong } = allDataSlice.actions
export default allDataSlice.reducer