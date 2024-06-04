import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { ItemData } from "../api/data";

interface AllItemDataState {
  allItemData: ItemData[];
}

const initialState: AllItemDataState = {
  allItemData: [],
};

export const allItemDataSlice = createSlice({
  name: "allItemData",
  initialState,
  reducers: {
    setAllItemData: (state, action: PayloadAction<ItemData[]>) => {
      state.allItemData = action.payload;
    },
  },
});

export const { setAllItemData } = allItemDataSlice.actions;

export const selectAllItemData = (state: RootState) => state.allPokemonData;
export default allItemDataSlice.reducer;
