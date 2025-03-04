import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/authSlice';
import ticketSlice from './features/ticketSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tickets: ticketSlice,
  },
});