import { createSlice } from "@reduxjs/toolkit";

export const profilesSlice = createSlice({
  name: "profiles",
  initialState: {
    profiles: [],
  },
  reducers: {
    setProfiles: (state, action) => {
      state.profiles = action.payload;
    },
  },
});

export const { setProfiles } = profilesSlice.actions;
export default profilesSlice.reducer;
