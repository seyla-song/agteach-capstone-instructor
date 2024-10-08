import { configureStore as createStore } from "@reduxjs/toolkit";
import { authApi } from "../services/api/authApi";
import { locationApi } from "../services/api/locationApi";
import { productApi } from "../services/api/productApi";
import userReducer from "../features/user/userSlice";
<<<<<<< HEAD
import { courseApi } from "../services/api/courseApi";
=======
import authSlice from "../features/user/authSlice";
>>>>>>> develop

export const store = createStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    user: userReducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      locationApi.middleware,
      productApi.middleware,
      courseApi.middleware
    ),
});
