import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user', // user is the only variable in our slice
  initialState: {
    user: null, // initially set to null meaning user logged out
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload; // on logging in the user is set to the payload which changes its value from null which denotes the user being logged in
    },
    logout: (state) => {
      state.user += null; // The state is changed back to null denoting the user being logged out
    },
  },
});

export const { login, logout } = userSlice.actions;
export const selectUser = state => state.user.user;

export default userSlice.reducer;
