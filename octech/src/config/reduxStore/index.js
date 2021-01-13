import { configureStore } from '@reduxjs/toolkit';
import { UserReducer } from '../../config';

// Redux wrapper with a variable of user set by userReducer
export default configureStore({
  reducer: {
    user: UserReducer,
  },
});