import { createSlice } from '@reduxjs/toolkit'
import { db } from '../../../utils/firebase'
import { useFirestore } from '../../../hooks/useFirestore'

const initialState = {
  editingPost: null,
  posts: [], // Thêm state lưu danh sách posts
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setEditingPost: (state, action) => {
      state.editingPost = action.payload
    },
    clearEditingPost: (state) => {
      state.editingPost = null
    },
    updateEditingPost: (state, action) => {
      state.editingPost = { ...state.editingPost, ...action.payload }
    },
    setPosts: (state, action) => { // Thêm reducer setPosts
      state.posts = action.payload
    }
  }
})

export const { setEditingPost, clearEditingPost, updateEditingPost, setPosts } = postSlice.actions
export default postSlice.reducer

export const fetchPosts = () => async (dispatch) => {
  const { getAllDocs } = useFirestore()
  const posts = await getAllDocs(db, 'posts')
  dispatch(setPosts(posts))
}