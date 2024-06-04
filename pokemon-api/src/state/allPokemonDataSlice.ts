import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { PokemonAllData } from "../api/data";

interface AllPokemonDataState {
  allPokemonData: PokemonAllData[];
}

const initialState: AllPokemonDataState = {
  allPokemonData: [],
};

export const allPokemonDataSlice = createSlice({
  name: "allPokemonData",
  initialState,
  reducers: {
    setAllPokemonData: (state, action: PayloadAction<PokemonAllData[]>) => {
      state.allPokemonData = action.payload;
    },
  },
});

export const { setAllPokemonData } = allPokemonDataSlice.actions;

export const selectAllPokemonData = (state: RootState) => state.allPokemonData;
export default allPokemonDataSlice.reducer;
