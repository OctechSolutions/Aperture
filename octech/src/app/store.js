import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';

// Redux wrapper with a variable of user set by userReducer
export default configureStore({
  reducer: {
    user: userReducer,
  },
});