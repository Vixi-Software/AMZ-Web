import { createSlice } from '@reduxjs/toolkit'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../../utils/firebase'
import { message } from 'antd'

const initialState = {
  user: null,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      state.loading = false
      state.error = null
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },
    clearUser(state) {
      state.user = null
      state.error = null
      state.loading = false
    }
  }
})

// Thunk actions cho Firebase Auth
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    dispatch(setUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
      // Thêm các thông tin user khác nếu cần
    }))
  } catch (error) {
    if (
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      message.error('Sai tài khoản hoặc mật khẩu')
    } else {
      message.error(error.message)
    }
  }
}

export const logout = () => async (dispatch) => {
  try {
    await signOut(auth)
    dispatch(clearUser())
  } catch (error) {
    dispatch(setError(error.message))
  }
}

// Lắng nghe trạng thái auth thay đổi
export const listenToAuthChanges = () => (dispatch) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }))
    } else {
      dispatch(clearUser())
    }
  })
}

export const { setUser, setLoading, setError, clearUser } = authSlice.actions
export default authSlice.reducer