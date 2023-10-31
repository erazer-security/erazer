import { configureStore } from "@reduxjs/toolkit";
import profilesReducer from "./profiles";
import userReducer from "./user";

export default configureStore({
  reducer: {
    profiles: profilesReducer,
    user: userReducer,
  },
});
