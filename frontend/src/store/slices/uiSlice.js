import { createSlice } from '@reduxjs/toolkit'; //ccreateslice: a function that creates a piece of the Redux store(a "slice") with its reducers & actions all in one place

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: localStorage.getItem('edupilot_theme') || 'dark',
    toast: {
      message: '',
      visible: false,
    },
  },
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = newTheme;
      localStorage.setItem('edupilot_theme', newTheme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('edupilot_theme', action.payload);
    },
    showToast: (state, action) => {
      state.toast.message = action.payload;
      state.toast.visible = true;
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
  },
});

export const { toggleTheme, setTheme, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
