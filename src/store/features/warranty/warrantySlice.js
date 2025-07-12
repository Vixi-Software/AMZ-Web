import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { warrantyService } from '../../../services/warrantyService'

// Async thunks
export const fetchWarranties = createAsyncThunk(
  'warranty/fetchWarranties',
  async (_, { rejectWithValue }) => {
    try {
      const warranties = await warrantyService.getAllWarranties()
      return warranties
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchWarrantyById = createAsyncThunk(
  'warranty/fetchWarrantyById',
  async (warrantyId, { rejectWithValue }) => {
    try {
      const warranty = await warrantyService.getWarrantyById(warrantyId)
      return warranty
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchWarrantyByCode = createAsyncThunk(
  'warranty/fetchWarrantyByCode',
  async (warrantyCode, { rejectWithValue }) => {
    try {
      const warranty = await warrantyService.getWarrantyByCode(warrantyCode)
      return warranty
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createWarranty = createAsyncThunk(
  'warranty/createWarranty',
  async (warrantyData, { rejectWithValue }) => {
    try {
      const newWarranty = await warrantyService.createWarranty(warrantyData)
      return newWarranty
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateWarranty = createAsyncThunk(
  'warranty/updateWarranty',
  async ({ warrantyId, warrantyData }, { rejectWithValue }) => {
    try {
      const updatedWarranty = await warrantyService.updateWarranty(warrantyId, warrantyData)
      return updatedWarranty
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteWarranty = createAsyncThunk(
  'warranty/deleteWarranty',
  async (warrantyId, { rejectWithValue }) => {
    try {
      await warrantyService.deleteWarranty(warrantyId)
      return warrantyId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchWarrantiesByStatus = createAsyncThunk(
  'warranty/fetchWarrantiesByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const warranties = await warrantyService.getWarrantiesByStatus(status)
      return { status, warranties }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchWarrantiesByPriority = createAsyncThunk(
  'warranty/fetchWarrantiesByPriority',
  async (priority, { rejectWithValue }) => {
    try {
      const warranties = await warrantyService.getWarrantiesByPriority(priority)
      return { priority, warranties }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchWarrantiesByCustomer = createAsyncThunk(
  'warranty/fetchWarrantiesByCustomer',
  async (customerName, { rejectWithValue }) => {
    try {
      const warranties = await warrantyService.getWarrantiesByCustomer(customerName)
      return { customerName, warranties }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateWarrantyStatus = createAsyncThunk(
  'warranty/updateWarrantyStatus',
  async ({ warrantyId, status, notes }, { rejectWithValue }) => {
    try {
      await warrantyService.updateWarrantyStatus(warrantyId, status, notes)
      return { warrantyId, status, notes }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  warranties: [],
  currentWarranty: null,
  warrantyByCode: null,
  warrantyByStatus: {},
  warrantyByPriority: {},
  warrantyByCustomer: {},
  loading: false,
  error: null,
  lastFetch: null,
  cacheTimeout: 5 * 60 * 1000, // 5 phút
}

const warrantySlice = createSlice({
  name: 'warranty',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentWarranty: (state) => {
      state.currentWarranty = null
    },
    clearWarrantyByCode: (state) => {
      state.warrantyByCode = null
    },
    setCacheTimeout: (state, action) => {
      state.cacheTimeout = action.payload
    },
    // Reducer để kiểm tra cache có hết hạn không
    checkCacheExpiry: (state) => {
      if (state.lastFetch) {
        const now = Date.now()
        const lastFetch = new Date(state.lastFetch).getTime()
        if (now - lastFetch > state.cacheTimeout) {
          state.warranties = []
          state.warrantyByStatus = {}
          state.warrantyByPriority = {}
          state.warrantyByCustomer = {}
          state.lastFetch = null
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all warranties
      .addCase(fetchWarranties.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWarranties.fulfilled, (state, action) => {
        state.loading = false
        state.warranties = action.payload
        state.lastFetch = new Date().toISOString()
      })
      .addCase(fetchWarranties.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch warranty by ID
      .addCase(fetchWarrantyById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWarrantyById.fulfilled, (state, action) => {
        state.loading = false
        state.currentWarranty = action.payload
      })
      .addCase(fetchWarrantyById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch warranty by code
      .addCase(fetchWarrantyByCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWarrantyByCode.fulfilled, (state, action) => {
        state.loading = false
        state.warrantyByCode = action.payload
      })
      .addCase(fetchWarrantyByCode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create warranty
      .addCase(createWarranty.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createWarranty.fulfilled, (state, action) => {
        state.loading = false
        state.warranties.push(action.payload)
      })
      .addCase(createWarranty.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update warranty
      .addCase(updateWarranty.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateWarranty.fulfilled, (state, action) => {
        state.loading = false
        const index = state.warranties.findIndex(warranty => warranty.id === action.payload.id)
        if (index !== -1) {
          state.warranties[index] = action.payload
        }
        if (state.currentWarranty && state.currentWarranty.id === action.payload.id) {
          state.currentWarranty = action.payload
        }
      })
      .addCase(updateWarranty.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete warranty
      .addCase(deleteWarranty.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteWarranty.fulfilled, (state, action) => {
        state.loading = false
        state.warranties = state.warranties.filter(warranty => warranty.id !== action.payload)
        if (state.currentWarranty && state.currentWarranty.id === action.payload) {
          state.currentWarranty = null
        }
      })
      .addCase(deleteWarranty.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch warranties by status
      .addCase(fetchWarrantiesByStatus.fulfilled, (state, action) => {
        state.warrantyByStatus[action.payload.status] = action.payload.warranties
      })

      // Fetch warranties by priority
      .addCase(fetchWarrantiesByPriority.fulfilled, (state, action) => {
        state.warrantyByPriority[action.payload.priority] = action.payload.warranties
      })

      // Fetch warranties by customer
      .addCase(fetchWarrantiesByCustomer.fulfilled, (state, action) => {
        state.warrantyByCustomer[action.payload.customerName] = action.payload.warranties
      })

      // Update warranty status
      .addCase(updateWarrantyStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateWarrantyStatus.fulfilled, (state, action) => {
        state.loading = false
        const { warrantyId, status, notes } = action.payload
        const index = state.warranties.findIndex(warranty => warranty.id === warrantyId)
        if (index !== -1) {
          state.warranties[index] = {
            ...state.warranties[index],
            status,
            notes,
            updatedAt: new Date().toISOString()
          }
        }
        if (state.currentWarranty && state.currentWarranty.id === warrantyId) {
          state.currentWarranty = {
            ...state.currentWarranty,
            status,
            notes,
            updatedAt: new Date().toISOString()
          }
        }
      })
      .addCase(updateWarrantyStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { 
  clearError, 
  clearCurrentWarranty, 
  clearWarrantyByCode, 
  setCacheTimeout, 
  checkCacheExpiry 
} = warrantySlice.actions

// Selectors
export const selectWarranties = (state) => state.warranty.warranties
export const selectCurrentWarranty = (state) => state.warranty.currentWarranty
export const selectWarrantyByCode = (state) => state.warranty.warrantyByCode
export const selectWarrantyByStatus = (state) => state.warranty.warrantyByStatus
export const selectWarrantyByPriority = (state) => state.warranty.warrantyByPriority
export const selectWarrantyByCustomer = (state) => state.warranty.warrantyByCustomer
export const selectWarrantyLoading = (state) => state.warranty.loading
export const selectWarrantyError = (state) => state.warranty.error
export const selectWarrantyLastFetch = (state) => state.warranty.lastFetch
export const selectWarrantyCacheTimeout = (state) => state.warranty.cacheTimeout

// Selector để kiểm tra cache có hết hạn không
export const selectIsWarrantyCacheExpired = (state) => {
  if (!state.warranty.lastFetch) return true
  const now = Date.now()
  const lastFetch = new Date(state.warranty.lastFetch).getTime()
  return now - lastFetch > state.warranty.cacheTimeout
}

export default warrantySlice.reducer
