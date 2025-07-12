import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, where, onSnapshot, getDocsFromCache, getDocsFromServer } from 'firebase/firestore'
import { db } from '../utils/firebase'

class WarrantyService {
  constructor() {
    this.collectionName = "warranties"
    this.collectionRef = collection(db, this.collectionName)
    this.lastSnapshot = null
  }

  // Lấy tất cả bảo hành với cache optimization
  async getAllWarranties(forceRefresh = false) {
    try {
      if (!forceRefresh) {
        // Thử lấy từ cache trước
        try {
          const cacheSnapshot = await getDocsFromCache(this.collectionRef)
          const warranties = []
          cacheSnapshot.forEach((doc) => {
            warranties.push({ id: doc.id, ...doc.data() })
          })
          
          if (warranties.length > 0) {
            console.log('📱 Lấy warranties từ cache')
            return warranties
          }
        } catch {
          console.log('⚠️ Cache không có dữ liệu, lấy từ server')
        }
      }

      // Lấy từ server
      const serverSnapshot = await getDocsFromServer(this.collectionRef)
      const warranties = []
      serverSnapshot.forEach((doc) => {
        warranties.push({ id: doc.id, ...doc.data() })
      })
      
      console.log('🌐 Lấy warranties từ server')
      return warranties
    } catch (error) {
      console.error('Error getting warranties:', error)
      throw error
    }
  }

  // Thiết lập listener để theo dõi thay đổi realtime
  setupRealtimeListener(callback) {
    return onSnapshot(this.collectionRef, (snapshot) => {
      const warranties = []
      snapshot.forEach((doc) => {
        warranties.push({ id: doc.id, ...doc.data() })
      })
      
      // Kiểm tra xem có thay đổi không
      if (this.lastSnapshot) {
        const hasChanges = !snapshot.metadata.hasPendingWrites && 
                          snapshot.docChanges().length > 0
        
        if (hasChanges) {
          console.log('🔄 Phát hiện thay đổi dữ liệu warranties')
          callback(warranties, true) // true = có thay đổi
        } else {
          callback(warranties, false) // false = không có thay đổi
        }
      } else {
        callback(warranties, true) // Lần đầu tiên
      }
      
      this.lastSnapshot = snapshot
    }, (error) => {
      console.error('Lỗi realtime listener:', error)
    })
  }

  // Thêm bảo hành mới
  async createWarranty(warrantyData) {
    try {
      const data = {
        ...warrantyData,
        warrantyCode: warrantyData.warrantyCode || `WR${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      const docRef = await addDoc(this.collectionRef, data)
      return { ...data, id: docRef.id }
    } catch (error) {
      console.error('Error creating warranty:', error)
      throw error
    }
  }

  // Cập nhật bảo hành
  async updateWarranty(warrantyId, warrantyData) {
    try {
      const data = {
        ...warrantyData,
        updatedAt: new Date().toISOString(),
      }
      const docRef = doc(db, this.collectionName, warrantyId)
      await updateDoc(docRef, data)
      return { ...data, id: warrantyId }
    } catch (error) {
      console.error('Error updating warranty:', error)
      throw error
    }
  }

  // Xóa bảo hành
  async deleteWarranty(warrantyId) {
    try {
      const docRef = doc(db, this.collectionName, warrantyId)
      await deleteDoc(docRef)
      return true
    } catch (error) {
      console.error('Error deleting warranty:', error)
      throw error
    }
  }

  // Lấy bảo hành theo ID
  async getWarrantyById(warrantyId) {
    try {
      const docRef = doc(db, this.collectionName, warrantyId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        throw new Error('Warranty not found')
      }
    } catch (error) {
      console.error('Error getting warranty by ID:', error)
      throw error
    }
  }

  // Lấy bảo hành theo mã bảo hành
  async getWarrantyByCode(warrantyCode) {
    try {
      const q = query(this.collectionRef, where("warrantyCode", "==", warrantyCode))
      const querySnapshot = await getDocs(q)
      const warranties = []
      querySnapshot.forEach((doc) => {
        warranties.push({ id: doc.id, ...doc.data() })
      })
      return warranties.length > 0 ? warranties[0] : null
    } catch (error) {
      console.error('Error getting warranty by code:', error)
      throw error
    }
  }

  // Lấy bảo hành theo trạng thái
  async getWarrantiesByStatus(status) {
    try {
      const q = query(this.collectionRef, where("status", "==", status))
      const querySnapshot = await getDocs(q)
      const warranties = []
      querySnapshot.forEach((doc) => {
        warranties.push({ id: doc.id, ...doc.data() })
      })
      return warranties
    } catch (error) {
      console.error('Error getting warranties by status:', error)
      throw error
    }
  }

  // Lấy bảo hành theo độ ưu tiên
  async getWarrantiesByPriority(priority) {
    try {
      const q = query(this.collectionRef, where("priority", "==", priority))
      const querySnapshot = await getDocs(q)
      const warranties = []
      querySnapshot.forEach((doc) => {
        warranties.push({ id: doc.id, ...doc.data() })
      })
      return warranties
    } catch (error) {
      console.error('Error getting warranties by priority:', error)
      throw error
    }
  }

  // Lấy bảo hành theo khách hàng
  async getWarrantiesByCustomer(customerName) {
    try {
      const q = query(this.collectionRef, where("customerName", "==", customerName))
      const querySnapshot = await getDocs(q)
      const warranties = []
      querySnapshot.forEach((doc) => {
        warranties.push({ id: doc.id, ...doc.data() })
      })
      return warranties
    } catch (error) {
      console.error('Error getting warranties by customer:', error)
      throw error
    }
  }

  // Cập nhật trạng thái bảo hành
  async updateWarrantyStatus(warrantyId, status, notes = '') {
    try {
      const data = {
        status,
        notes,
        updatedAt: new Date().toISOString(),
      }
      const docRef = doc(db, this.collectionName, warrantyId)
      await updateDoc(docRef, data)
      return true
    } catch (error) {
      console.error('Error updating warranty status:', error)
      throw error
    }
  }

  // Tạo mã bảo hành tự động
  generateWarrantyCode() {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `WR${timestamp}${random}`
  }

  // Validate dữ liệu bảo hành
  validateWarrantyData(data) {
    const errors = []
    
    if (!data.customerName || data.customerName.trim() === '') {
      errors.push('Tên khách hàng không được để trống')
    }
    
    if (!data.customerPhone || data.customerPhone.trim() === '') {
      errors.push('Số điện thoại không được để trống')
    }
    
    if (!data.customerEmail || data.customerEmail.trim() === '') {
      errors.push('Email không được để trống')
    } else if (!/\S+@\S+\.\S+/.test(data.customerEmail)) {
      errors.push('Email không hợp lệ')
    }
    
    if (!data.productName || data.productName.trim() === '') {
      errors.push('Tên sản phẩm không được để trống')
    }
    
    if (!data.issueDescription || data.issueDescription.trim() === '') {
      errors.push('Mô tả vấn đề không được để trống')
    }
    
    return errors
  }
}

// Export instance để sử dụng như singleton
export const warrantyService = new WarrantyService()
export default warrantyService
