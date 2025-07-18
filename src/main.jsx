import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store/store.js'
import { listenToAuthChanges } from './store/features/auth/authSlice'
// import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  ,
)
// store.dispatch(listenToAuthChanges())