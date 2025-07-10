import { createSlice } from '@reduxjs/toolkit'
import { data } from 'react-router-dom'

const initialState = {
  "01-nhet-tai-cu": [],
  "02-chup-tai-cu": [],
  "03-di-dong-cu": [],
  "04-de-ban-cu": [],
  "05-loa-karaoke": [],
  "06-hang-newseal": []
}

const allProductsSlice = createSlice({
  name: 'allProducts',
  initialState,
  reducers: {
    setData(state, action) {
      const type = action.payload.type
      const data = action.payload.data
      switch (type) {
        case "01-nhet-tai-cu":
          state["01-nhet-tai-cu"] = [...state["01-nhet-tai-cu"], data]
          break;
        case "02-chup-tai-cu":
          state["02-chup-tai-cu"] = [...state["02-chup-tai-cu"], data]
          break;
        case "03-di-dong-cu":
          state["03-di-dong-cu"] = [...state["03-di-dong-cu"], data]
          break;
        case "04-de-ban-cu":
          state["04-de-ban-cu"] = [...state["04-de-ban-cu"], data]
          break;
        case "05-loa-karaoke":
          state["05-loa-karaoke"] = [...state["05-loa-karaoke"], data]
          break;
        case "06-hang-newseal":
          state["06-hang-newseal"] = [...state["06-hang-newseal"], data]
          break;
        default:
          break;
      }
    },
    deleteAllProducts () {
      return initialState
    }
  }
})

export const importProductByType = (type, productData) => (dispatch) => {
  dispatch(setData({ type, data: productData }));
};


export const { setData, deleteAllProducts } = allProductsSlice.actions
export default allProductsSlice.reducer