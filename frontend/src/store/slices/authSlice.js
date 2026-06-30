import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  const saved = localStorage.getItem('edupilot_user'); //localStorage a built-in browser object that stores key-valus pairs(persist across page refreshes)
  return saved ? JSON.parse(saved) : null;
};
//getInitialiser is function , which reads the saved value under the key(edupilot_user) and puts it into 'saved' variable,if nothing is stored the return null
//localStorage stores only strings, JSON.parse() this converts into JS object

const authSlice = createSlice({  //authSlice which holding all entire slicce object
  name: 'auth',  //identifier for this slice
  initialState: {
    user: getInitialUser(),
    loading: false,  //no API call is happening yet
    error: null,  //no error exist
  },
  reducers: {  //an object containing functions that describe how state changes
    loginSuccess: (state, action) => { //'loginSuccess is a reducer name
      state.user = action.payload;
      localStorage.setItem('edupilot_user', JSON.stringify(action.payload));
      if (action.payload?.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },
    //loginSuccess: 1. saves user to redux state, so the whole app knows someone is logged in
    //2. saves user to localStorage, so user stays logged in even after page refresh


    logout: (state) => {
      state.user = null;
      localStorage.removeItem('edupilot_user');
      localStorage.removeItem('token');
    },
    //logout: 1. clears user from redux state, so the whole app knows user is logged out
    //2. removes user from localStorage, so user stays logged out even after page refresh


    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('edupilot_user', JSON.stringify(state.user));

        // Sync to global edupilot_users database to persist state across logins
        try {
          const usersList = JSON.parse(localStorage.getItem('edupilot_users') || '[]');
          const updatedUsers = usersList.map(u =>
            u.email.toLowerCase() === state.user.email.toLowerCase()
              ? { ...u, ...action.payload }
              : u
          );
          localStorage.setItem('edupilot_users', JSON.stringify(updatedUsers));
        } catch (err) {
          console.error("Failed to sync updated user preferences to localStorage list:", err);
          //try/catch wraps the localStorage sync-- if anything goes wrong (e.g. corrupted data), it logs the error instead of crashing the app.
        }
      }
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;

//Summary:
//the file manages the entire auth lifecycle-- login, logout, profile updates-- while keeping localStorage in sync so state survives page refreshes
