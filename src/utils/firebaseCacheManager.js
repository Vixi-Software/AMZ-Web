import { clearIndexedDbPersistence, disableNetwork, enableNetwork } from 'firebase/firestore'
import { db } from './firebase'

/**
 * Firebase Cache Management Utilities
 */

/**
 * Clear toàn bộ Firebase cache (cẩn thận với function này)
 */
export const clearFirebaseCache = async () => {
  try {
    console.log('🗑️ Clearing Firebase cache...')
    
    // Disable network trước
    await disableNetwork(db)
    
    // Clear indexedDB persistence
    await clearIndexedDbPersistence(db)
    
    // Enable network lại
    await enableNetwork(db)
    
    console.log('✅ Firebase cache cleared successfully')
    return true
  } catch (error) {
    console.error('❌ Error clearing Firebase cache:', error)
    
    // Đảm bảo network được enable lại
    try {
      await enableNetwork(db)
    } catch (enableError) {
      console.error('Error re-enabling network:', enableError)
    }
    
    throw error
  }
}

/**
 * Reset network connection để force refresh
 */
export const resetFirebaseConnection = async () => {
  try {
    console.log('🔄 Resetting Firebase connection...')
    
    await disableNetwork(db)
    
    // Đợi một chút
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await enableNetwork(db)
    
    console.log('✅ Firebase connection reset successfully')
    return true
  } catch (error) {
    console.error('❌ Error resetting Firebase connection:', error)
    throw error
  }
}

/**
 * Clear cache cho development/testing
 */
export const clearCacheForDevelopment = async () => {
  try {
    // Clear localStorage cache từ các utils
    const cacheKeys = [
      'tai_nghe_cache_v1',
      '02-chup-tai-cu',
      '03-di-dong-cu', 
      '04-de-ban-cu',
      '05-loa-karaoke',
      '06-hang-newseal',
      'home_settings_last_fetched'
    ]
    
    cacheKeys.forEach(key => {
      localStorage.removeItem(key)
      console.log(`🗑️ Removed localStorage key: ${key}`)
    })
    
    // Reset Firebase connection
    await resetFirebaseConnection()
    
    console.log('✅ Development cache cleared')
    return true
  } catch (error) {
    console.error('❌ Error clearing development cache:', error)
    throw error
  }
}

export default {
  clearFirebaseCache,
  resetFirebaseConnection,
  clearCacheForDevelopment
}
