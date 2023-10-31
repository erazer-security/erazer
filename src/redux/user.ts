import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: { firstName: "", lastName: "", userState: "All States", age: 0 },
  },
  reducers: {
    setFirstName: (state, action) => {
      state.user.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.user.lastName = action.payload;
    },
    setUserState: (state, action) => {
      state.user.userState = action.payload;
    },
    setAge: (state, action) => {
      state.user.age = action.payload;
    },
  },
});

export const { setFirstName, setLastName, setUserState, setAge } =
  userSlice.actions;
export default userSlice.reducer;
