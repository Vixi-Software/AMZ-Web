import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postServiceSlice = createSlice({
  name: "postService",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...action.payload.data };
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    clearPosts: (state) => {
      state.posts = [];
    }
  },
});

export const { setPosts, addPost, updatePost, deletePost, clearPosts } = postServiceSlice.actions;
export default postServiceSlice.reducer