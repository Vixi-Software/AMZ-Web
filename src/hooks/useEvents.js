import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback, useRef } from 'react'
import { 
  fetchEvents, 
  fetchEventsWithClearCache,
  selectEvents, 
  selectEventLoading, 
  selectEventError, 
  selectIsCacheExpired,
  checkCacheExpiry
} from '../store/features/event/eventSlice'
import { eventService } from '../services/eventService'

export const useEvents = (options = {}) => {
  const {
    autoFetch = true,
    enableRealtime = false,
    forceRefresh = false
  } = options

  const dispatch = useDispatch()
  const events = useSelector(selectEvents)
  const loading = useSelector(selectEventLoading)
  const error = useSelector(selectEventError)
  const isCacheExpired = useSelector(selectIsCacheExpired)
  
  const unsubscribeRef = useRef(null)

  // Fetch events with cache check
  const fetchEventsWithCache = useCallback(async () => {
    // Kiểm tra cache expiry
    dispatch(checkCacheExpiry())
    
    // Nếu có dữ liệu trong store và cache chưa hết hạn, không cần fetch
    if (events.length > 0 && !isCacheExpired && !forceRefresh) {
      console.log('📦 Sử dụng dữ liệu từ store cache')
      return
    }

    // Fetch dữ liệu mới
    dispatch(fetchEvents())
  }, [dispatch, events.length, isCacheExpired, forceRefresh])

  // Setup realtime listener
  const setupRealtime = useCallback(() => {
    if (enableRealtime && !unsubscribeRef.current) {
      unsubscribeRef.current = eventService.setupRealtimeListener((newEvents, hasChanges) => {
        if (hasChanges) {
          console.log('🔄 Cập nhật dữ liệu events từ realtime')
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
      fetchEventsWithCache()
    }
    
    if (enableRealtime) {
      setupRealtime()
    }

    return () => {
      cleanupRealtime()
    }
  }, [autoFetch, enableRealtime, fetchEventsWithCache, setupRealtime, cleanupRealtime])

  // Refresh function
  const refresh = useCallback(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  // Force refresh với clear cache
  const refreshWithClearCache = useCallback(async () => {
    try {
      console.log('🔄 Force refresh với clear cache')
      dispatch(fetchEventsWithClearCache())
    } catch (error) {
      console.error('Error refreshing with clear cache:', error)
    }
  }, [dispatch])

  return {
    events,
    loading,
    error,
    isCacheExpired,
    refresh,
    refreshWithClearCache, // Thêm function mới
    fetchEventsWithCache,
    setupRealtime,
    cleanupRealtime
  }
}
