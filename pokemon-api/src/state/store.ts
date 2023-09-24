import { configureStore } from "@reduxjs/toolkit";
import playerDataReducer from "./playerDataSlice";
import allPokemonDataReducer from "./allPokemonDataSlice";
import allItemDataReducer from "./allItemDataSlice";

export const store = configureStore({
  reducer: {
    playerData: playerDataReducer,
    allPokemonData: allPokemonDataReducer,
    allItemData: allItemDataReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
