import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const fetchTrips = createAsyncThunk("trips/fetchTrips", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/trips");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch trips");
  }
});

export const createTripThunk = createAsyncThunk("trips/createTrip", async (tripData, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/trips", tripData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create trip");
  }
});

export const deleteTripThunk = createAsyncThunk("trips/deleteTrip", async (tripId, { rejectWithValue }) => {
  try {
    await api.delete(`/trips/${tripId}`);
    return tripId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete trip");
  }
});

const initialState = {
  activeTrip: null,
  previousTrips: [],
  loading: false,
  error: null,
};

const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    setActiveTrip: (state, action) => {
      state.activeTrip = action.payload;
    },
    clearActiveTrip: (state) => {
      state.activeTrip = null;
    },
    toggleTodo: (state, action) => {
      const index = action.payload;
      if (state.activeTrip?.todoList?.[index] !== undefined) {
        state.activeTrip.todoList[index].done =
          !state.activeTrip.todoList[index].done;
      }
    },
    togglePacked: (state, action) => {
      const index = action.payload;
      if (state.activeTrip?.packing?.[index] !== undefined) {
        state.activeTrip.packing[index].packed =
          !state.activeTrip.packing[index].packed;
      }
    },
    setPreviousTrips: (state, action) => {
      state.previousTrips = action.payload;
    },
    addTrip: (state, action) => {
      state.previousTrips.push(action.payload);
    },
    removeTrip: (state, action) => {
      state.previousTrips = state.previousTrips.filter(
        (t) => t._id !== action.payload
      );
    },
    toggleTripTodo: (state, action) => {
      const { tripId, index } = action.payload;
      const trip = state.previousTrips.find((t) => t._id === tripId);
      if (trip?.todoList?.[index] !== undefined) {
        trip.todoList[index].done = !trip.todoList[index].done;
      }
    },
    toggleTripPacked: (state, action) => {
      const { tripId, index } = action.payload;
      const trip = state.previousTrips.find((t) => t._id === tripId);
      if (trip?.packing?.[index] !== undefined) {
        trip.packing[index].packed = !trip.packing[index].packed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.previousTrips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTripThunk.fulfilled, (state, action) => {
        state.previousTrips.unshift(action.payload);
      })
      .addCase(deleteTripThunk.fulfilled, (state, action) => {
        state.previousTrips = state.previousTrips.filter(
          (t) => t._id !== action.payload
        );
      });
  },
});

export const {
  setActiveTrip,
  clearActiveTrip,
  toggleTodo,
  togglePacked,
  setPreviousTrips,
  addTrip,
  removeTrip,
  toggleTripTodo,
  toggleTripPacked,
} = tripSlice.actions;
export default tripSlice.reducer;
