import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback, useRef } from 'react'
import { 
  fetchWarranties, 
  selectWarranties, 
  selectWarrantyLoading, 
  selectWarrantyError, 
  selectIsWarrantyCacheExpired,
  checkCacheExpiry
} from '../store/features/warranty/warrantySlice'
import { warrantyService } from '../services/warrantyService'

export const useWarranties = (options = {}) => {
  const {
    autoFetch = true,
    enableRealtime = false,
    forceRefresh = false
  } = options

  const dispatch = useDispatch()
  const warranties = useSelector(selectWarranties)
  const loading = useSelector(selectWarrantyLoading)
  const error = useSelector(selectWarrantyError)
  const isCacheExpired = useSelector(selectIsWarrantyCacheExpired)
  
  const unsubscribeRef = useRef(null)

  // Fetch warranties with cache check
  const fetchWarrantiesWithCache = useCallback(async () => {
    // Kiểm tra cache expiry
    dispatch(checkCacheExpiry())
    
    // Nếu có dữ liệu trong store và cache chưa hết hạn, không cần fetch
    if (warranties.length > 0 && !isCacheExpired && !forceRefresh) {
      console.log('📦 Sử dụng dữ liệu warranties từ store cache')
      return
    }

    // Fetch dữ liệu mới
    dispatch(fetchWarranties())
  }, [dispatch, warranties.length, isCacheExpired, forceRefresh])

  // Setup realtime listener
  const setupRealtime = useCallback(() => {
    if (enableRealtime && !unsubscribeRef.current) {
      unsubscribeRef.current = warrantyService.setupRealtimeListener((newWarranties, hasChanges) => {
        if (hasChanges) {
          console.log('🔄 Cập nhật dữ liệu warranties từ realtime')
          // Có thể dispatch action để update store
          // hoặc có thể implement logic khác tùy vào yêu cầu
        }
      })
    }
  }, [enableRealtime])

  // Cleanup realtime listener
  const cleanupRealtime = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }
  }, [])

  // Auto fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchWarrantiesWithCache()
    }
    
    if (enableRealtime) {
      setupRealtime()
    }

    return () => {
      cleanupRealtime()
    }
  }, [autoFetch, enableRealtime, fetchWarrantiesWithCache, setupRealtime, cleanupRealtime])

  // Refresh function
  const refresh = useCallback(() => {
    dispatch(fetchWarranties())
  }, [dispatch])

  return {
    warranties,
    loading,
    error,
    isCacheExpired,
    refresh,
    fetchWarrantiesWithCache,
    setupRealtime,
    cleanupRealtime
  }
}
