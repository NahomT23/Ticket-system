import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch all tickets
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { getState }) => {
    const token = getState().auth.token; // Get the token from the auth slice
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ticket/getAll`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tickets');
    }
    return data.data;
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ticketSlice.reducer;
