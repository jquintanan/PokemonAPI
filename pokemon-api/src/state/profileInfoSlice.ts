import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../state/store";

interface ProfileInfoState {
  name: string;
  money: number;
}

const initialState: ProfileInfoState = {
  name: "Red Ux",
  money: 3000,
};

export const profileInfoSlice = createSlice({
  name: "profileInfo",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setMoney: (state, action: PayloadAction<number>) => {
      state.money = action.payload;
    },
    increaseMoney: (state, action: PayloadAction<number>) => {
      state.money += action.payload;
    },
  },
});

export const { setName, setMoney, increaseMoney } = profileInfoSlice.actions;

export const selectProfileInfo = (state: RootState) => state.profileInfo;
export default profileInfoSlice.reducer;
