import { setHome } from '../store/features/settings/settingSlice'
import { getDoc, doc } from 'firebase/firestore'
import { db } from './firebase'

export const fetchHomeSetting = async (dispatch) => {
  const docRef = doc(db, 'home', 'home')
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    dispatch(setHome(docSnap.data()))
  }
}