// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/authSlice';
import ticketSlice from './features/ticketSlice';
import themeSlice from './features/themeSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tickets: ticketSlice,
    theme: themeSlice
  },
});
