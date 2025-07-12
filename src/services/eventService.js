import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, onSnapshot, getDocsFromCache, getDocsFromServer } from 'firebase/firestore'
import { db } from '../utils/firebase'

class EventService {
  constructor() {
    this.collectionName = "eventAMZ"
    this.collectionRef = collection(db, this.collectionName)
    this.lastSnapshot = null
    // Cache trong memory
    this.cachedEvents = null
    this.lastCacheTime = null
    this.realtimeListener = null
    // Cache expiry time: 5 phút
    this.CACHE_DURATION = 5 * 60 * 1000
  }

  // Kiểm tra cache còn hiệu lực không
  isCacheValid() {
    if (!this.cachedEvents || !this.lastCacheTime) {
      return false
    }
    const now = Date.now()
    return (now - this.lastCacheTime) < this.CACHE_DURATION
  }

  // Cập nhật cache
  updateCache(events) {
    this.cachedEvents = events
    this.lastCacheTime = Date.now()
    console.log('💾 Updated memory cache with', events.length, 'events')
  }

  // Lấy tất cả sự kiện với cache optimization
  async getAllEvents(forceRefresh = false) {
    try {
      // Nếu có cache hợp lệ và không force refresh, trả về cache
      if (!forceRefresh && this.isCacheValid()) {
        console.log('⚡ Lấy events từ memory cache')
        return this.cachedEvents
      }

      // Nếu force refresh, luôn lấy từ server
      if (forceRefresh) {
        console.log('🔄 Force refresh - Lấy events từ server')
        const serverSnapshot = await getDocsFromServer(this.collectionRef)
        const events = []
        serverSnapshot.forEach((doc) => {
          events.push({ id: doc.id, ...doc.data() })
        })
        this.updateCache(events)
        return events
      }

      // Nếu có realtime listener đang hoạt động và có cache, sử dụng cache
      if (this.realtimeListener && this.cachedEvents) {
        console.log('🔄 Sử dụng cache với realtime listener')
        return this.cachedEvents
      }

      // Thử lấy từ cache Firebase trước
      try {
        console.log('📱 Thử lấy events từ Firebase cache')
        const cacheSnapshot = await getDocsFromCache(this.collectionRef)
        const events = []
        cacheSnapshot.forEach((doc) => {
          events.push({ id: doc.id, ...doc.data() })
        })
        
        if (events.length > 0) {
          console.log('📱 Lấy events từ Firebase cache thành công')
          this.updateCache(events)
          return events
        }
      } catch {
        console.log('📱 Firebase cache không khả dụng, lấy từ server')
      }

      // Cuối cùng mới lấy từ server
      console.log('🌐 Lấy events từ server')
      const serverSnapshot = await getDocsFromServer(this.collectionRef)
      const events = []
      serverSnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() })
      })
      this.updateCache(events)
      return events

    } catch (error) {
      console.error('Error getting events:', error)
      
      // Nếu có cache cũ, trả về cache cũ thay vì throw error
      if (this.cachedEvents) {
        console.log('⚠️ Lỗi server, sử dụng cache cũ')
        return this.cachedEvents
      }
      
      throw error
    }
  }

  // Thiết lập listener để theo dõi thay đổi realtime
  setupRealtimeListener(callback) {
    // Nếu đã có listener, hủy listener cũ
    if (this.realtimeListener) {
      this.realtimeListener()
      this.realtimeListener = null
    }

    this.realtimeListener = onSnapshot(this.collectionRef, (snapshot) => {
      const events = []
      snapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() })
      })
      
      // Cập nhật cache khi có dữ liệu mới
      this.updateCache(events)
      
      // Kiểm tra xem có thay đổi không
      if (this.lastSnapshot) {
        const hasChanges = !snapshot.metadata.hasPendingWrites && 
                          snapshot.docChanges().length > 0
        
        if (hasChanges) {
          console.log('🔄 Phát hiện thay đổi dữ liệu events')
          callback(events, true) // true = có thay đổi
        } else {
          callback(events, false) // false = không có thay đổi
        }
      } else {
        callback(events, true) // Lần đầu tiên
      }
      
      this.lastSnapshot = snapshot
    }, (error) => {
      console.error('Lỗi realtime listener:', error)
    })

    return this.realtimeListener
  }

  // Hủy realtime listener
  unsubscribeRealtimeListener() {
    if (this.realtimeListener) {
      this.realtimeListener()
      this.realtimeListener = null
      console.log('🔇 Đã hủy realtime listener')
    }
  }

  // Thêm sự kiện mới
  async createEvent(eventData) {
    try {
      const data = {
        ...eventData,
        date: eventData.date.format('YYYY-MM-DD'),
        endDate: eventData.endDate ? eventData.endDate.format('YYYY-MM-DD') : null,
        createdAt: new Date().toISOString(),
      }
      const docRef = await addDoc(this.collectionRef, data)
      
      // Invalidate cache để force refresh lần sau
      this.cachedEvents = null
      this.lastCacheTime = null
      
      return { ...data, id: docRef.id }
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  // Cập nhật sự kiện
  async updateEvent(eventId, eventData) {
    try {
      const data = {
        ...eventData,
        date: eventData.date.format('YYYY-MM-DD'),
        endDate: eventData.endDate ? eventData.endDate.format('YYYY-MM-DD') : null,
        updatedAt: new Date().toISOString(),
      }
      const docRef = doc(db, this.collectionName, eventId)
      await updateDoc(docRef, data)
      
      // Invalidate cache để force refresh lần sau
      this.cachedEvents = null
      this.lastCacheTime = null
      
      return { ...data, id: eventId }
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  // Xóa sự kiện
  async deleteEvent(eventId) {
    try {
      const docRef = doc(db, this.collectionName, eventId)
      await deleteDoc(docRef)
      
      // Invalidate cache để force refresh lần sau
      this.cachedEvents = null
      this.lastCacheTime = null
      
      return true
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }

  // Lấy sự kiện theo ID (với cache)
  async getEventById(eventId) {
    try {
      // Kiểm tra trong cache trước
      if (this.cachedEvents) {
        const cachedEvent = this.cachedEvents.find(event => event.id === eventId)
        if (cachedEvent) {
          console.log('⚡ Lấy event từ memory cache')
          return cachedEvent
        }
      }

      // Nếu không có trong cache, lấy từ Firebase
      const docRef = doc(db, this.collectionName, eventId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        throw new Error('Event not found')
      }
    } catch (error) {
      console.error('Error getting event by ID:', error)
      throw error
    }
  }

  // Kiểm tra sự kiện có đang diễn ra không
  isEventActive(event) {
    const now = new Date()
    const startDate = new Date(event.date)
    const endDate = new Date(event.endDate)
    
    return now >= startDate && now <= endDate
  }

  // Lấy các sự kiện đang diễn ra (sử dụng cache)
  async getActiveEvents() {
    try {
      const allEvents = await this.getAllEvents() // Sử dụng cache tự động
      return allEvents.filter(event => this.isEventActive(event))
    } catch (error) {
      console.error('Error getting active events:', error)
      throw error
    }
  }

  // Lấy các sự kiện sắp diễn ra (sử dụng cache)
  async getUpcomingEvents() {
    try {
      const allEvents = await this.getAllEvents() // Sử dụng cache tự động
      const now = new Date()
      return allEvents.filter(event => new Date(event.date) > now)
    } catch (error) {
      console.error('Error getting upcoming events:', error)
      throw error
    }
  }

  // Xóa cache và force refresh
  async clearCacheAndRefresh() {
    try {
      console.log('🗑️ Clearing cache và refresh dữ liệu')
      this.cachedEvents = null
      this.lastCacheTime = null
      return await this.getAllEvents(true)
    } catch (error) {
      console.error('Error clearing cache and refresh:', error)
      throw error
    }
  }

  // Lấy dữ liệu mới nhất (luôn từ server)
  async getFreshEvents() {
    return await this.getAllEvents(true)
  }

  // Phương thức để lấy thống kê cache
  getCacheStats() {
    return {
      hasCachedData: !!this.cachedEvents,
      cacheSize: this.cachedEvents ? this.cachedEvents.length : 0,
      lastCacheTime: this.lastCacheTime,
      isCacheValid: this.isCacheValid(),
      hasRealtimeListener: !!this.realtimeListener,
      cacheAge: this.lastCacheTime ? Date.now() - this.lastCacheTime : null
    }
  }
}

// Export instance để sử dụng như singleton
export const eventService = new EventService()
export default eventService
