import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studyReducer from './slices/studySlice';
import uiReducer from './slices/uiSlice';
import syncMiddleware from './middleware/syncMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    study: studyReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(syncMiddleware),
});

export * from './slices/authSlice';
export * from './slices/studySlice';
export * from './slices/uiSlice';
