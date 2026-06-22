import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studyReducer from './slices/studySlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    study: studyReducer,
    ui: uiReducer,
  },
});

export * from './slices/authSlice';
export * from './slices/studySlice';
export * from './slices/uiSlice';
