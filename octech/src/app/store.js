<<<<<<< HEAD:octech/src/app/reduxStore.js
import { configureStore } from '@reduxjs/toolkit';
import { UserReducer } from '../config';

// Redux wrapper with a variable of user set by userReducer
export default configureStore({
  reducer: {
    user: UserReducer,
  },
});
=======
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';

// Redux wrapper with a variable of user set by userReducer
export default configureStore({
  reducer: {
    user: userReducer,
  },
});
>>>>>>> e647c3ac2f061134574d14fc54620a7c63491b17:octech/src/app/store.js
