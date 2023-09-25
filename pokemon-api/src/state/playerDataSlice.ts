import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { ItemData, PokemonAllData } from "../api";
import { Item } from "firebase/analytics";
import PokemonInstance from "../PokemonInstance.class";

interface PlayerDataState {
  name: string;
  money: number;
  ownedPokemon: PokemonInstance[];
  ownedItems: { item: ItemData; amount: number }[];
  selectedPokemon: PokemonInstance | null;
}

const initialState: PlayerDataState = {
  name: "Red Ux",
  money: 100000,
  ownedPokemon: [],
  ownedItems: [],
  selectedPokemon: null,
};

export const playerDataSlice = createSlice({
  name: "playerData",
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
    addItem: (
      state,
      action: PayloadAction<{ item: ItemData; amount: number }>
    ) => {
      const item = state.ownedItems.find(
        (i) => i.item.id === action.payload.item.id
      );
      if (item) {
        item.amount += action.payload.amount;
      } else {
        state.ownedItems.push(action.payload);
      }
    },
    removeItem: (
      state,
      action: PayloadAction<{ item: ItemData; amount: number }>
    ) => {
      // Decrease the amount of specified item from user inventory, remove item from state if amount reaches 0
      const item = state.ownedItems.find(
        (i) => i.item.id === action.payload.item.id
      );
      if (item) {
        item.amount -= action.payload.amount;
        if (item.amount <= 0) {
          state.ownedItems = state.ownedItems.filter(
            (i) => i.item.id !== action.payload.item.id
          );
        }
      }
    },
    addPokemon: (state, action: PayloadAction<PokemonInstance>) => {
      state.ownedPokemon.push(action.payload);
    },
    removePokemon: (state, action: PayloadAction<PokemonInstance>) => {
      state.ownedPokemon = state.ownedPokemon.filter(
        (p) => p.id !== action.payload.id
      );

      if (state.selectedPokemon?.id === action.payload.id)
        state.selectedPokemon = state.ownedPokemon[0] ?? null;
    },
    setSelectedPokemon: (state, action: PayloadAction<PokemonInstance>) => {
      state.selectedPokemon = action.payload;
    },
    increaseExpForPokemon: (
      state,
      action: PayloadAction<{ pokemon: PokemonInstance; exp: number }>
    ) => {
      const pokemon = state.ownedPokemon.find(
        (p) => p.id === action.payload.pokemon.id
      );
      if (pokemon) {
        pokemon.increaseExp(action.payload.exp);
      }
    },
  },
});

export const {
  setName,
  setMoney,
  increaseMoney,
  addItem,
  removeItem,
  addPokemon,
  removePokemon,
  setSelectedPokemon,
  increaseExpForPokemon,
} = playerDataSlice.actions;

export const selecPlayerData = (state: RootState) => state.playerData;
export default playerDataSlice.reducer;
