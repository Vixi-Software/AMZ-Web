import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { eventService } from '../../../services/eventService'

// Async thunks
export const fetchEvents = createAsyncThunk(
  'event/fetchEvents',
  async (forceRefresh = false, { rejectWithValue }) => {
    try {
      const events = await eventService.getAllEvents(forceRefresh)
      return events
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchEventsWithClearCache = createAsyncThunk(
  'event/fetchEventsWithClearCache',
  async (_, { rejectWithValue }) => {
    try {
      const events = await eventService.clearCacheAndRefresh()
      return events
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchEventById = createAsyncThunk(
  'event/fetchEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      const event = await eventService.getEventById(eventId)
      return event
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createEvent = createAsyncThunk(
  'event/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const newEvent = await eventService.createEvent(eventData)
      return newEvent
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateEvent = createAsyncThunk(
  'event/updateEvent',
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      const updatedEvent = await eventService.updateEvent(eventId, eventData)
      return updatedEvent
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteEvent = createAsyncThunk(
  'event/deleteEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(eventId)
      return eventId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchActiveEvents = createAsyncThunk(
  'event/fetchActiveEvents',
  async (_, { rejectWithValue }) => {
    try {
      const activeEvents = await eventService.getActiveEvents()
      return activeEvents
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchUpcomingEvents = createAsyncThunk(
  'event/fetchUpcomingEvents',
  async (_, { rejectWithValue }) => {
    try {
      const upcomingEvents = await eventService.getUpcomingEvents()
      return upcomingEvents
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  events: [],
  activeEvents: [],
  upcomingEvents: [],
  currentEvent: null,
  loading: false,
  error: null,
  lastFetch: null,
  cacheTimeout: 5 * 60 * 1000, // 5 phút
}

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null
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
          state.events = []
          state.activeEvents = []
          state.upcomingEvents = []
          state.lastFetch = null
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
        state.lastFetch = new Date().toISOString()
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false
        state.currentEvent = action.payload
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events.push(action.payload)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false
        const index = state.events.findIndex(event => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
        if (state.currentEvent && state.currentEvent.id === action.payload.id) {
          state.currentEvent = action.payload
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events = state.events.filter(event => event.id !== action.payload)
        if (state.currentEvent && state.currentEvent.id === action.payload) {
          state.currentEvent = null
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch active events
      .addCase(fetchActiveEvents.fulfilled, (state, action) => {
        state.activeEvents = action.payload
      })

      // Fetch upcoming events
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.upcomingEvents = action.payload
      })

      // Fetch events with clear cache
      .addCase(fetchEventsWithClearCache.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventsWithClearCache.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
        state.lastFetch = new Date().toISOString()
        // Force clear cache expired flag
        state.lastFetch = new Date().toISOString()
      })
      .addCase(fetchEventsWithClearCache.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentEvent, setCacheTimeout, checkCacheExpiry } = eventSlice.actions

// Selectors
export const selectEvents = (state) => state.event.events
export const selectActiveEvents = (state) => state.event.activeEvents
export const selectUpcomingEvents = (state) => state.event.upcomingEvents
export const selectCurrentEvent = (state) => state.event.currentEvent
export const selectEventLoading = (state) => state.event.loading
export const selectEventError = (state) => state.event.error
export const selectLastFetch = (state) => state.event.lastFetch
export const selectCacheTimeout = (state) => state.event.cacheTimeout

// Selector để kiểm tra cache có hết hạn không
export const selectIsCacheExpired = (state) => {
  if (!state.event.lastFetch) return true
  const now = Date.now()
  const lastFetch = new Date(state.event.lastFetch).getTime()
  return now - lastFetch > state.event.cacheTimeout
}

export default eventSlice.reducer
